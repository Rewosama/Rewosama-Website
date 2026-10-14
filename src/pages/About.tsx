import { Navigate } from 'react-router-dom'

/** Hakkımda artık ana sayfada; eski bağlantılar ana sayfaya gider. */
export default function About() {
  return <Navigate to="/" replace />
}