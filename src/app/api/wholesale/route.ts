import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const WholesaleSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  businessName: z.string().min(2, "Business name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  whatsapp: z.string().optional().nullable(),
  location: z.string().min(2, "City and state are required"),
  quantityInterested: z.string().min(1, "Please specify estimated order volume"),
  message: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = WholesaleSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const {
      fullName,
      businessName,
      email,
      phone,
      whatsapp,
      location,
      quantityInterested,
      message,
    } = validated.data;

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("wholesale_enquiries")
      .insert({
        full_name: fullName,
        business_name: businessName,
        email: email,
        phone: phone,
        whatsapp: whatsapp || null,
        location: location,
        quantity_interested: quantityInterested,
        message: message || null,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Wholesale enquiry database error:", error);
      return NextResponse.json(
        { error: "Failed to submit wholesale enquiry" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, enquiryId: data.id });
  } catch (err: unknown) {
    console.error("Wholesale route error:", err);
    return NextResponse.json(
      { error: "Unexpected error handling wholesale submission" },
      { status: 500 }
    );
  }
}
