import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border bg-card text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <CardTitle className="font-serif text-2xl text-foreground">
            Error de Autenticación
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Hubo un problema al iniciar sesión. Por favor, intenta de nuevo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/auth/login">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Intentar de nuevo
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
              Volver al inicio
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
