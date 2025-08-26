"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, Clock, User, Building2, Shield, Copy, ExternalLink } from "lucide-react"

interface EmailInvitationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userData: {
    name: string
    email: string
    role: string
    department: string
  }
}

export default function EmailInvitationModal({ open, onOpenChange, userData }: EmailInvitationModalProps) {
  const [emailSending, setEmailSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [inviteLink] = useState(`https://trackdoc.empresa.com/setup-password?token=abc123xyz789`)

  const handleSendEmail = async () => {
    setEmailSending(true)

    // Simular envio de email
    await new Promise((resolve) => setTimeout(resolve, 2500))

    setEmailSending(false)
    setEmailSent(true)
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    // Aqui você poderia adicionar um toast de confirmação
  }

  const resetModal = () => {
    setEmailSending(false)
    setEmailSent(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={resetModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Convite por Email</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{userData.name}</h3>
                  <p className="text-gray-600">{userData.email}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>{userData.role}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Building2 className="h-3 w-3" />
                      <span>{userData.department}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center">
                  {emailSent ? (
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  ) : emailSending ? (
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="h-8 w-8 text-blue-600 animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Mail className="h-8 w-8 text-gray-600" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    {emailSent ? "Convite Enviado!" : emailSending ? "Enviando Convite..." : "Enviar Convite"}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {emailSent ? (
                      <>
                        O convite foi enviado para <strong>{userData.email}</strong>.
                        <br />O usuário receberá instruções para criar sua senha de acesso.
                      </>
                    ) : emailSending ? (
                      "Preparando e enviando o email de convite..."
                    ) : (
                      <>
                        Um email será enviado para <strong>{userData.email}</strong> com um link seguro para criação da
                        senha.
                      </>
                    )}
                  </p>
                </div>

                {emailSending && (
                  <div className="flex items-center justify-center space-x-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">Processando convite...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Email Preview */}
          {!emailSending && !emailSent && (
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Prévia do Email</span>
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <div className="space-y-2">
                    <p>
                      <strong>Para:</strong> {userData.email}
                    </p>
                    <p>
                      <strong>Assunto:</strong> Bem-vindo ao TrackDoc - Configure sua conta
                    </p>
                    <div className="border-t pt-3 mt-3">
                      <p>Olá {userData.name},</p>
                      <p className="mt-2">
                        Você foi convidado para acessar o sistema TrackDoc como <strong>{userData.role}</strong> no
                        departamento de <strong>{userData.department}</strong>.
                      </p>
                      <p className="mt-2">
                        Para começar a usar o sistema, clique no link abaixo para criar sua senha de acesso:
                      </p>
                      <div className="bg-blue-50 p-2 rounded mt-2 text-blue-700 font-mono text-xs">{inviteLink}</div>
                      <p className="mt-2 text-gray-600">
                        Este link é válido por 48 horas. Se você não criou esta conta, ignore este email.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invite Link (after email sent) */}
          {emailSent && (
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Link de Convite</span>
                </h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg font-mono text-sm text-gray-700">{inviteLink}</div>
                  <Button variant="outline" size="sm" onClick={copyInviteLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Você também pode compartilhar este link diretamente com o usuário
                </p>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          {emailSent && (
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Próximos Passos</span>
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">1</span>
                    </div>
                    <p>O usuário receberá o email em alguns minutos</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">2</span>
                    </div>
                    <p>Ele clicará no link para acessar a página de criação de senha</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">3</span>
                    </div>
                    <p>Após criar a senha, poderá fazer login no sistema</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <p>O usuário estará ativo e pronto para usar o TrackDoc</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            {!emailSent && !emailSending && (
              <>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSendEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Convite
                </Button>
              </>
            )}

            {emailSent && <Button onClick={resetModal}>Concluir</Button>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
