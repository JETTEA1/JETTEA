import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jqbynynnkydrfqlgeyoz.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxYnlueW5ua3lkcmZxbGdleW96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDI2Mzc2NiwiZXhwIjoyMTA1ODM5NzY2fQ.h25nK7psBijvLfKwyDLKRAJKD7G6Nzw5oXXBFUnAEdU";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function runTests() {
  console.log("==========================================");
  console.log("JETTEA® E-Commerce Platform Automated Tests");
  console.log("==========================================\n");

  let passed = 0;
  let failed = 0;

  // Test 1: Verify Product & Variants in Database
  console.log("Test 1: Querying Product and Variants...");
  const { data: product, error: prodErr } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("slug", "jettea-green-tea")
    .single();

  if (prodErr || !product || product.product_variants.length !== 3) {
    console.error("FAIL: Product or variants missing", prodErr);
    failed++;
  } else {
    console.log(`PASS: Found product "${product.name}" with ${product.product_variants.length} active variants.`);
    product.product_variants.forEach(v => {
      console.log(`   - Variant: ${v.name} | Price: ₦${v.price} | Sachet Eq: ${v.sachet_equivalent}`);
    });
    passed++;
  }

  // Test 2: Check Initial Inventory Level
  console.log("\nTest 2: Checking Inventory Balances...");
  const { data: inv, error: invErr } = await supabase.from("inventory").select("*").single();
  if (invErr || !inv || inv.total_sachets_in_stock < 20000) {
    console.error("FAIL: Inventory verification failed", invErr);
    failed++;
  } else {
    const cartons = Math.floor(inv.total_sachets_in_stock / 288);
    const packets = Math.floor(inv.total_sachets_in_stock / 24);
    console.log(`PASS: Current stock is ${inv.total_sachets_in_stock} sachets (${cartons} cartons / ${packets} packets).`);
    passed++;
  }

  // Test 3: Create Order & Execute Atomic Payment Fulfillment
  console.log("\nTest 3: Creating Test Order and Testing Atomic Stock Decrement...");
  const testOrderNumber = `JT-TEST-${Date.now().toString(36).toUpperCase()}`;
  const packetVariant = product.product_variants.find(v => v.unit_type === "packet");

  const { data: newOrder, error: orderErr } = await supabase
    .from("orders")
    .insert({
      order_number: testOrderNumber,
      customer_name: "Automated QA Tester",
      customer_email: "qa@jettea.ng",
      customer_phone: "08012345678",
      delivery_address: "123 Test Avenue, Victoria Island",
      delivery_city: "Lagos",
      delivery_state: "Lagos",
      subtotal: packetVariant.price * 2,
      delivery_fee: 2000,
      total_amount: packetVariant.price * 2 + 2000,
      currency: "NGN",
      payment_status: "pending",
      fulfillment_status: "unfulfilled",
    })
    .select()
    .single();

  if (orderErr || !newOrder) {
    console.error("FAIL: Order creation failed", orderErr);
    failed++;
  } else {
    console.log(`PASS: Created test order #${newOrder.order_number} (ID: ${newOrder.id})`);

    // Insert order items (2 packets = 48 sachets)
    await supabase.from("order_items").insert({
      order_id: newOrder.id,
      variant_id: packetVariant.id,
      variant_name: `JETTEA® - ${packetVariant.name}`,
      unit_price: packetVariant.price,
      quantity: 2,
      sachet_equivalent: 24,
      line_total: packetVariant.price * 2,
    });

    const stockBefore = inv.total_sachets_in_stock;

    // Execute atomic payment fulfillment
    const { data: rpcResult, error: rpcErr } = await supabase.rpc("mark_order_paid_atomic", {
      p_order_id: newOrder.id,
      p_payment_id: null,
      p_provider_ref: "QA-TEST-PAYMENT-REF",
    });

    if (rpcErr || !rpcResult.success) {
      console.error("FAIL: mark_order_paid_atomic failed", rpcErr);
      failed++;
    } else {
      console.log(`PASS: Order marked paid atomically. New balance: ${rpcResult.new_balance_sachets} sachets.`);
      if (rpcResult.new_balance_sachets === stockBefore - 48) {
        console.log(`PASS: Exactly 48 sachets (2 packets) were decremented.`);
        passed++;
      } else {
        console.error("FAIL: Decrement discrepancy detected");
        failed++;
      }
    }
  }

  // Test 4: Wholesale Enquiry Submission
  console.log("\nTest 4: Testing Wholesale Enquiry Submission...");
  const { data: wholesale, error: wsErr } = await supabase
    .from("wholesale_enquiries")
    .insert({
      full_name: "Alhaji Musa",
      business_name: "Kano Mega Distributors",
      email: "musa@kanodist.ng",
      phone: "08099887766",
      location: "Kano State",
      quantity_interested: "50-100+ Cartons",
      message: "Looking to distribute across Northern retail hubs.",
    })
    .select()
    .single();

  if (wsErr || !wholesale) {
    console.error("FAIL: Wholesale submission error", wsErr);
    failed++;
  } else {
    console.log(`PASS: Wholesale lead submitted for "${wholesale.business_name}" (ID: ${wholesale.id}).`);
    passed++;
  }

  // Test 5: Delivery Zones
  console.log("\nTest 5: Testing Delivery Zones Config...");
  const { data: zones, error: zoneErr } = await supabase.from("delivery_zones").select("*");
  if (zoneErr || !zones || zones.length < 5) {
    console.error("FAIL: Delivery zones verification failed", zoneErr);
    failed++;
  } else {
    console.log(`PASS: Found ${zones.length} active Nigerian delivery zones.`);
    passed++;
  }

  console.log("\n==========================================");
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================");
}

runTests();
