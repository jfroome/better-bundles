import { Link } from "@shopify/polaris"

export function dateFormatter(dateToFormat) {
  return dateToFormat.getFullYear() + "/" + (dateToFormat.getMonth() + 1) + "/" + dateToFormat.getDate()
}

export function moneyV2Formatter(currencyCode, amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode
  }).format(amount)
}

export function linkFormatter(linkTitle, linkUrl) {
  return (
    <Link
      url={linkUrl}
      external={true}
    >
      {linkTitle}
    </Link>
  )
}
