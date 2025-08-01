

import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
    const body = await req.json();
    const { productSlug } = body
    try {
        const product = await productDetail(productSlug);

        if (product === null) {
            return NextResponse.json({ message: 'No products found in this slug' }, { status: 404 });
        }

        return NextResponse.json({ message: "all Good", products: product }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}