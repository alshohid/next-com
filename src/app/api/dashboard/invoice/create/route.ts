import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const headerList = headers();
    const id = parseInt(headerList.get("id") as any);
    const email = headerList.get("email");
    const prisma = new PrismaClient();

    //1.calculate total payable cartlist amount  and vat
    const cartList = await prisma.product_carts.findMany({
      where: { user_id: id },
      include: { products: true },
    });

    let totalAmount = 0;
    cartList.forEach((element) => {
      let price;
      if (element.products.discount) {
        price = element?.products?.discount_price;
      } else {
        price = element?.products?.price;
      }
      totalAmount += element?.qty * price;
    });
    let vat = totalAmount * 0.05; //5% vat
    let payableamount = totalAmount + vat;

    //2 prepare customer details and shipping details
    const profile = await prisma.customer_profiles.findUnique({
      where: {
        user_id: id,
      },
    });
    let customerDetails = `Name : ${profile?.cus_name}, Email : ${email}, Address : ${profile?.cus_add}, Phone : ${profile?.cus_phone}`;
    let shippingDetails = `Name : ${profile?.ship_name}, City : ${profile?.ship_city}, Address : ${profile?.ship_add}`;

    //3 Set up transaction id and other id
    let tran_id = Math.floor(10000000 + Math.random() * 90000000).toString();
    let val_id = "0";
    let delivery_status = "Pending";
    let payment_status = "Pending";
    //4 create invoice
    const createInvoice = await prisma.invoices.create({
      data: {
        total: totalAmount,
        vat: vat,
        payable: payableamount,
        cus_details: customerDetails,
        ship_details: shippingDetails,
        tran_id: tran_id,
        val_id: val_id,
        delivery_status: delivery_status as any,
        payment_status: payment_status,
        user_id: id,
      },
    });

    //5 create invoice product
    let invoiceId = createInvoice.id;
    for (const element of cartList) {
      await prisma.invoice_products.create({
        data: {
          invoice_id: invoiceId,
          user_id: id,
          product_id: element.product_id,
          qty: element.qty,
          sale_price: element.products.discount
            ? element.products.discount_price
            : element.products.price,
          color: element.color,
          size: element.size,
        },
      });
    }
    //6 Remove cart products
    await prisma.product_carts.deleteMany({
      where: { user_id: id },
    });
    //7 payment with  dummy sandbox
    const paymentSetting = await prisma.sslcommerz_accounts.findFirst();

    const form = new FormData();
    form.append("store_id", `${paymentSetting?.store_id}`);
    form.append("store_passwd", `${paymentSetting?.store_passwd}`);
    form.append("total_amount", `${payableamount.toString()}`);
    form.append("currency", `${paymentSetting?.currency}`);
    form.append("tran_id", `${tran_id}`);
    form.append(
      "success_url",
      `${paymentSetting?.success_url}?train_id=${tran_id}`
    );
    form.append("fail_url", `${paymentSetting?.fail_url}?train_id=${tran_id}`);
    form.append(
      "cancel_url",
      `${paymentSetting?.success_url}?train_id=${tran_id}`
    );
    form.append(
      "ipn_url",
      `${paymentSetting?.success_url}?train_id=${tran_id}`
    );
    form.append("shipping_method", "YES");
    form.append("product_name", "According to invoice");
    form.append("product_category", "According to invoice");
    form.append("product_profile", "According to invoice");
    form.append("product_amount", "According to invoice");
    form.append("cus_name", `${profile?.cus_name}`);
    form.append("cus_email", `${email}`);
    form.append("cus_add1", `${profile?.cus_add}`);
    form.append("cus_add2", `${profile?.cus_add}`);
    form.append("cus_city", `${profile?.cus_city}`);
    form.append("cus_state", `${profile?.cus_state}`);
    form.append("cus_postcode", `${profile?.cus_postcode}`);
    form.append("cus_country", `${profile?.cus_country}`);
    form.append("cus_phone", `${profile?.cus_phone}`);
    form.append("cus_fax", `${profile?.cus_fax}`);
    form.append("ship_name", `${profile?.ship_name}`);
    form.append("ship_add1", `${profile?.ship_add}`);
    form.append("ship_add2", `${profile?.ship_add}`);
    form.append("ship_city", `${profile?.ship_city}`);
    form.append("ship_state", `${profile?.ship_state}`);
    form.append("ship_postcode", `${profile?.ship_postcode}`);
    form.append("ship_country", `${profile?.ship_country}`);

    let sslres = await fetch(`${paymentSetting?.init_url}`, {
      method: "POST",
      body: form,
    });
    let ssljsonRes = await sslres.json();

    return NextResponse.json({ status: "success", data: ssljsonRes });
  } catch (error) {
    return NextResponse.json({ status: "fail", data: error });
  }
}
