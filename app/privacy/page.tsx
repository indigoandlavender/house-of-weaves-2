import LegalPageContent from '@/components/LegalPageContent'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Privacy Policy — House of Weaves',
}

export default function PrivacyPage() {
  return <LegalPageContent templateId="privacy" />
}
