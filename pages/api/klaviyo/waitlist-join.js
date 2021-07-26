import qs from 'qs'
import axios from 'axios'

export default async function send(req, res) {
  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'must be a POST request' })
  }

  const {
    body: { accountID, email, variant },
  } = req

  // honeypot
  if (req.body.fullname !== '') {
    console.log('stuck in honey')
    return res.status(200).json({ status: 202 })
  }

  if (!email || !accountID) {
    console.log('no email or account ID provided')
    return res
      .status(404)
      .json({ error: 'must contain an email address and account ID' })
  }

  const payload = qs.stringify({
    a: accountID,
    platform: 'shopify',
    email: email,
    variant: variant,
  })

  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: payload,
    url: 'https://a.klaviyo.com/api/v1/catalog/subscribe',
  }

  const waitlistData = await axios(options).then((res) => res.data)

  res.statusCode = 200
  res.json(waitlistData)
}
