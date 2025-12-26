import LegalPageContent from '@/components/LegalPageContent'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Disclaimer — House of Weaves',
}

export default function DisclaimerPage() {
  return <LegalPageContent templateId="disclaimer" />
}
