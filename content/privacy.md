# Privacy Policy

**Effective:** 6 August 2026 · **Last updated:** 6 August 2026

This policy explains what information **[www.minified.work](https://www.minified.work/)** collects when you visit, why, and what happens to it. It is written to meet our obligations under the New Zealand **Privacy Act 2020**.

**The short version:** this site has no accounts, no payments, and no advertising. It sets **no cookies of its own**. We collect server logs for security, and cookieless aggregate analytics to see which pages get read. We do not sell or share your information for marketing, and we do not track you across other sites.

## Contents

1. [Who is responsible](#1-who-is-responsible)
2. [What we collect](#2-what-we-collect)
3. [What we do not collect](#3-what-we-do-not-collect)
4. [Why we collect it](#4-why-we-collect-it)
5. [How long we keep it](#5-how-long-we-keep-it)
6. [Who else can see it](#6-who-else-can-see-it)
7. [Where it is stored](#7-where-it-is-stored)
8. [Cookies](#8-cookies)
9. [Do Not Track and Global Privacy Control](#9-do-not-track-and-global-privacy-control)
10. [Your rights: access and correction](#10-your-rights-access-and-correction)
11. [Children](#11-children)
12. [Security](#12-security)
13. [Changes to this policy](#13-changes-to-this-policy)
14. [Contact and complaints](#14-contact-and-complaints)

---

## 1. Who is responsible

**Minified.Work** is the name under which **Bjorn Basar**, an independent software engineer based in Aotearoa New Zealand, publishes and builds software. It is not a registered company. Bjorn Basar is the agency responsible for personal information collected through this site.

Contact: **[bjorn@minified.work](mailto:bjorn@minified.work)**

## 2. What we collect

### Server logs

The site is served through our own reverse proxy, which records a line per request:

- your **IP address**;
- the **date and time** of the request;
- the **page or file requested**, and the HTTP status returned;
- your **browser user-agent string** (browser and operating system);
- the **referring page**, where your browser sends one.

This is standard web-server logging. It happens for every visitor and is not optional — it is how the site is operated and defended.

### Analytics

We use **[GoatCounter](https://www.goatcounter.com)**, self-hosted by us at `traffic.bjornbasar.com`. It is cookieless and does not follow you between sites.

When you load a page, a small script sends:

- the **path** of the page you viewed;
- the **referring URL**, where your browser sends one;
- the **page title**;
- your **screen width**;
- the **query string** of the URL;
- a random value used only to prevent caching of the request.

GoatCounter derives an approximate **country** and your **browser and operating system** from the request, and — per its own documentation — does not store your IP address, instead using a short-lived salted hash to recognise repeat views within a session. Its privacy documentation is at [goatcounter.com/help/privacy](https://www.goatcounter.com/help/privacy). Because we self-host it, this data stays on our infrastructure and is not shared with an analytics vendor.

If you would rather not be counted at all, a content blocker or the browser setting that blocks third-party scripts will prevent the analytics request. The site works fully without it.

### Email you send us

If you email us, we receive and retain your **email address**, your **message**, and anything you choose to include in it. We use it to reply to you and to keep a record of the correspondence. See section 6 of our [Terms of Use](/terms/) before sending anything confidential.

## 3. What we do not collect

To be explicit, this site has:

- **no user accounts**, logins, registration, or profiles;
- **no payments**, orders, or billing — no card or bank details ever reach us;
- **no advertising**, ad networks, or advertising identifiers;
- **no Google Analytics**, Meta pixel, or third-party tracking or marketing tags;
- **no cross-site tracking** and no attempt to build a profile of you;
- **no sale or trade** of personal information, for marketing or anything else.

We collect only what is described in section 2.

## 4. Why we collect it

| Information | Purpose |
|---|---|
| Server logs | Operating the site; diagnosing faults; detecting and investigating abuse, attacks, and misuse; keeping the infrastructure secure |
| Analytics | Understanding, in aggregate, which pages are read and how people arrive — so the site can be improved |
| Email | Replying to your enquiry and keeping a record of the correspondence |

We do not use any of it to make automated decisions about you, and we do not use it for marketing.

## 5. How long we keep it

- **Server logs** — rotated daily and retained for **14 days**, then deleted.
- **Analytics** — kept as aggregate page-view records with no fixed expiry, so trends remain comparable over time. It is not linked to an identified person.
- **Email** — kept while the correspondence remains relevant, then deleted.

## 6. Who else can see it

We do not sell, rent, or trade your information, and we do not disclose it for anyone else's marketing.

It is disclosed only in these circumstances:

- **Cloudflare**, our content-delivery and security provider, sits in front of the site. Your request reaches Cloudflare before it reaches us, so Cloudflare processes your IP address and request under its own privacy policy and keeps its own logs. This is what protects the site from attack and hides its origin address.
- **Where the law requires it** — to comply with a legal obligation, or to respond to a lawful request such as a court order, warrant, or a properly made request from a regulator or law-enforcement agency.
- **To protect rights and safety** — where disclosure is necessary to prevent or investigate a serious threat, or to establish, exercise, or defend a legal claim.

Analytics is self-hosted, so no third-party analytics provider receives your data.

## 7. Where it is stored

The site and its analytics run on **our own hardware in New Zealand**. Server logs and analytics data stay on that infrastructure.

Cloudflare operates globally, so your request passes through whichever of its data centres is nearest to you, which may be outside New Zealand. Email is handled by our mail provider, which may also store it outside New Zealand.

## 8. Cookies

**This site sets no cookies of its own.** There is nothing to consent to and nothing to opt out of, because we do not use cookies for analytics, advertising, or preferences.

Cloudflare may set its own strictly necessary cookies — most commonly `__cf_bm`, a bot-management cookie — as part of protecting the site. We do not control or read those, and they are not used to profile you. Blocking them may affect your ability to reach the site.

## 9. Do Not Track and Global Privacy Control

We want to be straight about this rather than claim a courtesy we do not extend: **our server logs and analytics do not change based on a Do Not Track or Global Privacy Control signal.** The analytics script we use does not check for those signals, and server logging happens before any such preference could be read.

That is a deliberately narrow statement, and here is why it should not worry you: there is no tracking to switch off. No cookies are set, no cross-site identifier exists, no profile is built, and nothing is shared with an advertiser or data broker. If you want the analytics request suppressed entirely, block the script as described in section 2.

## 10. Your rights: access and correction

Under the **Privacy Act 2020** you have the right to:

- **ask whether we hold personal information about you, and to see it** (information privacy principle 6); and
- **ask us to correct it** if you believe it is wrong (information privacy principle 7).

To make a request, email **[bjorn@minified.work](mailto:bjorn@minified.work)**. We will respond as soon as reasonably practicable, and within **20 working days**, as the Act requires. There is no charge for a request from an individual about their own information.

**A practical limit you should know about:** server logs are keyed to IP addresses, not to people. Unless you can tell us the IP address and the approximate time you visited, we usually have no way to find your records or to confirm they are yours — and the logs are deleted after 14 days regardless. Analytics data is aggregate and not linked to an identified person, so it generally contains nothing we could retrieve about you individually. This is a consequence of collecting as little as we do, not a refusal to help; we will do what we reasonably can with whatever detail you can give us.

Correspondence you have sent us by email is straightforward to find, and we will provide or correct it on request.

## 11. Children

This site is aimed at a professional audience and is not directed at children. We do not knowingly collect personal information from children, and the site provides no way for anyone to submit personal information beyond the automatic logging described above.

## 12. Security

The site is served over **HTTPS** with TLS certificates, sits behind Cloudflare with rate limiting, and runs on infrastructure we maintain ourselves with access restricted to us. Log files are readable only by administrative users on the host.

No system is perfectly secure, and we cannot guarantee the security of information in transit over the internet. Email in particular is not a secure medium.

## 13. Changes to this policy

We may update this policy to reflect changes in how the site works, or for operational, legal, or regulatory reasons. The revised version will be posted on this page with a new effective date, and material changes will be evident from that date.

## 14. Contact and complaints

For any privacy question, request, or concern: **[bjorn@minified.work](mailto:bjorn@minified.work)**

If you are not satisfied with how we have handled your privacy request or complaint, you can complain to the **Office of the Privacy Commissioner**:

- Web: [privacy.org.nz](https://www.privacy.org.nz)
- Email: [enquiries@privacy.org.nz](mailto:enquiries@privacy.org.nz)
- Phone: 0800 803 909

See also our **[Terms of Use](/terms/)**.
