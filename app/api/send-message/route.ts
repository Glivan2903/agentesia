import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const WEBHOOK_URL = "https://n8n.jetsalesbrasil.com/webhook/7b2635a9-259a-4905-bd21-08385864e321"

  try {
    const body = await req.json()
    console.log("Received payload from client:", body)

    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      console.error(`Webhook returned an error: ${webhookResponse.status} - ${errorText}`)
      return NextResponse.json({ error: `Webhook error: ${errorText}` }, { status: webhookResponse.status })
    }

    const contentType = webhookResponse.headers.get("content-type")
    let responseData: any

    if (contentType && contentType.includes("application/json")) {
      responseData = await webhookResponse.json()
    } else {
      const textResponse = await webhookResponse.text()
      responseData = { output: textResponse } // Wrap non-JSON text in an 'output' field
    }

    console.log("Webhook response data:", responseData)
    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("API/send-message error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
