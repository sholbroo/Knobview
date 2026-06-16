exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const SYSTEM = `You are a friendly, knowledgeable assistant for Knobview Retreat, a luxury vacation rental cabin in Swannanoa, NC (Blue Ridge Mountains). Help potential guests learn about the property and encourage them to book directly at knobview.com for the best price.

PROPERTY: 3BR/3BA, sleeps 6, 2,900 ft elevation, Swannanoa NC. Less than 20 min to Asheville, Biltmore Estate, Black Mountain. 15 min to Blue Ridge Parkway.

BEDROOMS: Master (King, mountain views), Bedroom 2 (Queen), Bedroom 3 (Queen).

AMENITIES: Private hot tub with panoramic views, fire table, gas grill, wraparound deck, fully stocked kitchen, Bose sound system, Samsung smart TV, WiFi 96Mbps (network: Knobview-Guest, password: Knobview), washer/dryer, fireplace, ping pong table, second refrigerator in garage, hiking gear.

RATINGS: Airbnb 5.0 stars, 139 reviews, Superhost, Top 1%. VRBO 10/10, 300+ reviews, Top 10% in area. 435+ combined reviews.

PRICING: Book direct at knobview.com for best price — saves significantly vs Airbnb which charges 15%+ in fees. Cleaning fee $175 flat. NC taxes 12.75% total (6.75% sales + 6% Buncombe County occupancy). Min stay 2 nights. Check-in 4pm, checkout 11am. Secure Stripe payments.

CANCELLATION: Full refund 30+ days before check-in. Within 30 days non-refundable unless dates are re-booked.

HOUSE RULES: No smoking indoors. No pets. Maximum 6 guests.

LOCAL AREA: Asheville ~20 min (vibrant food scene, craft beer, arts). Biltmore Estate ~20 min. Black Mountain ~15 min. Blue Ridge Parkway ~15 min. World-class hiking nearby.

CONTACT: 5knobview@gmail.com. Hosts Steve and Henrietta Holbrooks respond personally, usually within the hour.

Keep responses warm, friendly and concise (2-4 sentences unless more detail is needed). Always encourage direct booking at knobview.com when relevant. If a guest asks to speak to a real person, tell them to click "Chat with Steve & Henrietta directly" below or email 5knobview@gmail.com.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM,
        messages: messages
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://knobview.com',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ reply: data.content?.[0]?.text || "I'm not sure about that — please email us at 5knobview@gmail.com and we'll get right back to you!" })
    };

  } catch (err) {
    console.error('Chat function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "I'm having trouble right now — please email us at 5knobview@gmail.com or click the live chat button below!" })
    };
  }
};
