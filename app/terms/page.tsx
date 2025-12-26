import LegalPageContent from '@/components/LegalPageContent'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Terms of Service — House of Weaves',
}

export default function TermsPage() {
  return <LegalPageContent templateId="terms" />
}
