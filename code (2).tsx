"use client"

import React, { useState, useRef } from 'react'
import { Button } from '/components/ui/button'
import { Input } from '/components/ui/input'
import { Textarea } from '/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '/components/ui/card'
import { Label } from '/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '/components/ui/select'
import { 
  Search, BookOpen, FileText, MessageSquare, Calendar, Users, 
  Library, Quote, Share2, Accessibility, ChevronDown, Upload,
  Download, GraduationCap, Brain, Sparkles, Clock, Menu, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays } from 'date-fns'

export default function EricDongoAcademyHub() {
  const [activeSection, setActiveSection] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([])
  const [chatInput, setChatInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [seminarTopic, setSeminarTopic] = useState('')
  const [seminarFormat, setSeminarFormat] = useState('ppt')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [citationStyle, setCitationStyle] = useState('apa')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedDiscipline, setSelectedDiscipline] = useState('')
  const [calendarEvents, setCalendarEvents] = useState([
    { date: new Date(), title: 'Exame Nacional de Matemática', type: 'exam' },
    { date: addDays(new Date(), 7), title: 'Prazo de Inscrição - Universidade', type: 'deadline' },
    { date: addDays(new Date(), 14), title: 'Simulado de Física', type: 'test' }
  ])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const disciplines = {
    secondary: [
      { name: 'Biologia', icon: '🧬', description: 'Estudo da vida e organismos vivos' },
      { name: 'Física', icon: '⚛️', description: 'Leis da natureza e fenômenos físicos' },
      { name: 'Química', icon: '🧪', description: 'Composição e transformação da matéria' },
      { name: 'Matemática', icon: '📐', description: 'Números, formas e padrões lógicos' },
      { name: 'História', icon: '📜', description: 'Eventos e civilizações do passado' },
      { name: 'Geografia', icon: '🌍', description: 'Estudo da Terra e suas características' },
      { name: 'Filosofia', icon: '🤔', description: 'Reflexão sobre existência e conhecimento' },
      { name: 'Inglês', icon: '🇬🇧', description: 'Língua inglesa e literatura' },
      { name: 'Português', icon: '🇵🇹', description: 'Língua portuguesa e gramática' },
      { name: 'Educação Física', icon: '⚽', description: 'Saúde, esporte e movimento' }
    ],
    university: [
      { name: 'Bioquímica', icon: '🔬', description: 'Processos químicos em sistemas vivos' },
      { name: 'Anatomia', icon: '🫀', description: 'Estrutura do corpo humano' },
      { name: 'Biologia Celular', icon: '🦠', description: 'Estudo das células e moléculas' },
      { name: 'Epidemiologia', icon: '📊', description: 'Distribuição de doenças nas populações' },
      { name: 'Engenharia Civil', icon: '🏗️', description: 'Construção e infraestrutura' },
      { name: 'Ciência da Computação', icon: '💻', description: 'Algoritmos e programação' },
      { name: 'Administração', icon: '📈', description: 'Gestão e organização empresarial' },
      { name: 'Direito', icon: '⚖️', description: 'Sistema jurídico e leis' },
      { name: 'Psicologia', icon: '🧠', description: 'Comportamento e processos mentais' },
      { name: 'Sociologia', icon: '👥', description: 'Sociedade e relações sociais' }
    ]
  }

  const handleSeminarGeneration = async () => {
    if (!seminarTopic.trim()) return

    setIsGenerating(true)
    
    try {
      const systemPrompt = `Você é um assistente especializado em criar seminários acadêmicos estruturados. 
      Crie um seminário detalhado no formato ${seminarFormat === 'ppt' ? 'PowerPoint' : 'Word'} sobre o tema fornecido.
      Inclua: introdução, objetivos, desenvolvimento com tópicos principais, conclusão e referências.
      O conteúdo deve ser educativo, bem estruturado e adequado para estudantes acadêmicos.
      Forneça o conteúdo em formato de texto estruturado que possa ser convertido facilmente.`

      const response = await fetch('https://llm.blackbox.ai/chat/completions', {
        method: 'POST',
        headers: {
          'customerId': 'cus_TIonMFWJX3BLMl',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer xxx'
        },
        body: JSON.stringify({
          model: 'openrouter/claude-sonnet-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Crie um seminário completo sobre: ${seminarTopic}` }
          ]
        })
      })

      const data = await response.json()
      const seminarContent = data.choices[0].message.content

      // Create downloadable file
      const blob = new Blob([seminarContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `seminario-${seminarTopic.replace(/\s+/g, '-')}.${seminarFormat === 'ppt' ? 'txt' : 'doc'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert('Seminário gerado e baixado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar seminário:', error)
      alert('Erro ao gerar seminário. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return

    const userMessage = { role: 'user', content: chatInput }
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsGenerating(true)

    try {
      const systemPrompt = `Você é um assistente educacional especializado em ajudar estudantes acadêmicos.
      Forneça respostas claras, educativas e motivadoras. Ajude com dúvidas sobre matérias, métodos de estudo,
      organização acadêmica e orientação para melhorar o desempenho escolar.`

      const response = await fetch('https://llm.blackbox.ai/chat/completions', {
        method: 'POST',
        headers: {
          'customerId': 'cus_TIonMFWJX3BLMl',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer xxx'
        },
        body: JSON.stringify({
          model: 'openrouter/claude-sonnet-4',
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatMessages.slice(-5),
            userMessage
          ]
        })
      })

      const data = await response.json()
      const assistantMessage = { role: 'assistant', content: data.choices[0].message.content }
      setChatMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Erro no chat:', error)
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, ocorreu um erro. Tente novamente.' 
      }])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const generateCitation = () => {
    alert(`Gerador de citações no formato ${citationStyle.toUpperCase()} será implementado.`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Custom CSS for red accent color theme */}
      <style>{`
        :root {
          --primary: 0 84% 60%;
          --primary-foreground: 0 0% 100%;
          --destructive: 0 84% 60%;
        }
        .gradient-red {
          background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
        }
        .hover-red:hover {
          background-color: #DC2626;
        }
        .border-red {
          border-color: #DC2626;
        }
        .text-red {
          color: #EF4444;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-red-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 gradient-red rounded-lg flex items-center justify-center">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Eric Dongo</h1>
                <p className="text-sm text-red-400">Academy Hub</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Button 
                variant="ghost" 
                onClick={() => setActiveSection('home')}
                className="hover-red"
              >
                Início
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setActiveSection('disciplines')}
                className="hover-red"
              >
                Disciplinas
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setActiveSection('seminar')}
                className="hover-red"
              >
                Criar Seminário
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setActiveSection('chat')}
                className="hover-red"
              >
                IA Assistente
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setActiveSection('calendar')}
                className="hover-red"
              >
                Calendário
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 pb-4 space-y-2"
              >
                <Button 
                  variant="ghost" 
                  onClick={() => { setActiveSection('home'); setMobileMenuOpen(false); }}
                  className="w-full justify-start hover-red"
                >
                  Início
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => { setActiveSection('disciplines'); setMobileMenuOpen(false); }}
                  className="w-full justify-start hover-red"
                >
                  Disciplinas
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => { setActiveSection('seminar'); setMobileMenuOpen(false); }}
                  className="w-full justify-start hover-red"
                >
                  Criar Seminário
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => { setActiveSection('chat'); setMobileMenuOpen(false); }}
                  className="w-full justify-start hover-red"
                >
                  IA Assistente
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => { setActiveSection('calendar'); setMobileMenuOpen(false); }}
                  className="w-full justify-start hover-red"
                >
                  Calendário
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {activeSection === 'home' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Hero Banner */}
            <div className="gradient-red rounded-2xl p-12 text-center">
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold mb-4"
              >
                Potencialize Seu Aprendizado
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl mb-8 text-white/90"
              >
                Academia gratuita com IA para estudantes do ensino secundário e universitário
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => setActiveSection('disciplines')}
                  className="bg-black text-white hover:bg-gray-900 text-lg px-8 py-6"
                >
                  Começar Agora
                  <Sparkles className="ml-2" />
                </Button>
              </motion.div>
            </div>

            {/* Quick Search */}
            <Card className="bg-gray-900 border-red-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Search className="text-red-500" />
                  Busca Rápida de Disciplinas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Digite o nome da disciplina..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black border-red-900 text-white"
                  />
                  <Button className="gradient-red">
                    Buscar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gray-900 border-red-900 hover:border-red-500 transition-all cursor-pointer">
                <CardHeader>
                  <BookOpen className="w-12 h-12 text-red-500 mb-4" />
                  <CardTitle className="text-white">Disciplinas Completas</CardTitle>
                  <CardDescription className="text-gray-400">
                    Conteúdo para ensino secundário e universitário em múltiplas áreas
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-900 border-red-900 hover:border-red-500 transition-all cursor-pointer">
                <CardHeader>
                  <FileText className="w-12 h-12 text-red-500 mb-4" />
                  <CardTitle className="text-white">Seminários com IA</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gere apresentações e documentos acadêmicos automaticamente
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-900 border-red-900 hover:border-red-500 transition-all cursor-pointer">
                <CardHeader>
                  <Brain className="w-12 h-12 text-red-500 mb-4" />
                  <CardTitle className="text-white">Modelos 3D Interativos</CardTitle>
                  <CardDescription className="text-gray-400">
                    Visualize conceitos complexos com recursos visuais avançados
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-900 border-red-900 hover:border-red-500 transition-all cursor-pointer">
                <CardHeader>
                  <MessageSquare className="w-12 h-12 text-red-500 mb-4" />
                  <CardTitle className="text-white">Assistente IA 24/7</CardTitle>
                  <CardDescription className="text-gray-400">
                    Tire dúvidas e receba orientação personalizada instantaneamente
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-900 border-red-900 hover:border-red-500 transition-all cursor-pointer">
                <CardHeader>
                  <Users className="w-12 h-12 text-red-500 mb-4" />
                  <CardTitle className="text-white">Grupos de Estudo</CardTitle>
                  <CardDescription className="text-gray-400">
                    Colabore com outros estudantes em projetos e trabalhos
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-900 border-red-900 hover:border-red-500 transition-all cursor-pointer">
                <CardHeader>
                  <Calendar className="w-12 h-12 text-red-500 mb-4" />
                  <CardTitle className="text-white">Calendário Acadêmico</CardTitle>
                  <CardDescription className="text-gray-400">
                    Acompanhe datas importantes, exames e prazos
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-4 gap-6 mt-12">
              <div className="text-center p-6 bg-gray-900 rounded-lg border border-red-900">
                <div className="text-4xl font-bold text-red-500 mb-2">20+</div>
                <div className="text-gray-400">Disciplinas</div>
              </div>
              <div className="text-center p-6 bg-gray-900 rounded-lg border border-red-900">
                <div className="text-4xl font-bold text-red-500 mb-2">100%</div>
                <div className="text-gray-400">Gratuito</div>
              </div>
              <div className="text-center p-6 bg-gray-900 rounded-lg border border-red-900">
                <div className="text-4xl font-bold text-red-500 mb-2">24/7</div>
                <div className="text-gray-400">Disponível</div>
              </div>
              <div className="text-center p-6 bg-gray-900 rounded-lg border border-red-900">
                <div className="text-4xl font-bold text-red-500 mb-2">IA</div>
                <div className="text-gray-400">Tecnologia</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Disciplines Section */}
        {activeSection === 'disciplines' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-white">Explore Todas as Disciplinas</h2>
              <p className="text-xl text-gray-400">Conteúdo completo para o seu sucesso acadêmico</p>
            </div>

            {/* Search Bar */}
            <Card className="bg-gray-900 border-red-900">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Input
                    placeholder="Buscar disciplina..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black border-red-900 text-white"
                  />
                  <Button className="gradient-red">
                    <Search />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Secondary Level */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <BookOpen className="text-red-500" />
                Ensino Secundário
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {disciplines.secondary.map((discipline, index) => (
                  <motion.div
                    key={discipline.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="bg-gray-900 border-red-900 hover:border-red-500 transition-all cursor-pointer h-full"
                      onClick={() => setSelectedDiscipline(discipline.name)}
                    >
                      <CardHeader>
                        <div className="text-4xl mb-3">{discipline.icon}</div>
                        <CardTitle className="text-white">{discipline.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {discipline.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full border-red-900 hover:bg-red-900">
                          Explorar Conteúdo
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* University Level */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <GraduationCap className="text-red-500" />
                Ensino Universitário
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {disciplines.university.map((discipline, index) => (
                  <motion.div
                    key={discipline.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="bg-gray-900 border-red-900 hover:border-red-500 transition-all cursor-pointer h-full"
                      onClick={() => setSelectedDiscipline(discipline.name)}
                    >
                      <CardHeader>
                        <div className="text-4xl mb-3">{discipline.icon}</div>
                        <CardTitle className="text-white">{discipline.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {discipline.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full border-red-900 hover:bg-red-900">
                          Explorar Conteúdo
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 3D Models Section */}
            <Card className="bg-gray-900 border-red-900 mt-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="text-red-500" />
                  Modelos 3D Interativos
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Visualize conceitos complexos com modelos anatômicos e científicos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-black rounded-lg p-12 text-center border-2 border-dashed border-red-900">
                  <Brain className="w-24 h-24 text-red-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Visualização 3D Interativa</p>
                  <p className="text-sm text-gray-500">
                    Modelos anatômicos universais com legendas em múltiplos idiomas
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Seminar Generation Section */}
        {activeSection === 'seminar' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-white">Gerador de Seminários com IA</h2>
              <p className="text-xl text-gray-400">Crie apresentações e documentos acadêmicos automaticamente</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <Card className="bg-gray-900 border-red-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileText className="text-red-500" />
                    Configuração do Seminário
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="topic" className="text-white mb-2 block">Tema do Seminário</Label>
                    <Textarea
                      id="topic"
                      placeholder="Ex: A Revolução Industrial e seus impactos na sociedade moderna"
                      value={seminarTopic}
                      onChange={(e) => setSeminarTopic(e.target.value)}
                      className="bg-black border-red-900 text-white min-h-32"
                    />
                  </div>

                  <div>
                    <Label htmlFor="format" className="text-white mb-2 block">Formato de Saída</Label>
                    <Select value={seminarFormat} onValueChange={setSeminarFormat}>
                      <SelectTrigger className="bg-black border-red-900 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ppt">PowerPoint (PPT)</SelectItem>
                        <SelectItem value="doc">Word Document (DOC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Upload de Arquivo (Opcional)</Label>
                    <div className="border-2 border-dashed border-red-900 rounded-lg p-8 text-center bg-black">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                      />
                      <Upload className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">
                        {uploadedFile ? uploadedFile.name : 'Arraste um arquivo ou clique para fazer upload'}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-red-900 hover:bg-red-900"
                      >
                        Selecionar Arquivo
                      </Button>
                    </div>
                  </div>

                  <Button
                    className="w-full gradient-red text-lg py-6"
                    onClick={handleSeminarGeneration}
                    disabled={isGenerating || !seminarTopic.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <Clock className="animate-spin mr-2" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2" />
                        Gerar Seminário
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Features Section */}
              <div className="space-y-6">
                <Card className="bg-gray-900 border-red-900">
                  <CardHeader>
                    <CardTitle className="text-white">Como Funciona</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 gradient-red rounded-full flex items-center justify-center flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Defina o Tema</h4>
                        <p className="text-sm text-gray-400">
                          Escreva o tema do seu seminário ou faça upload de um arquivo
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 gradient-red rounded-full flex items-center justify-center flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">IA Processa</h4>
                        <p className="text-sm text-gray-400">
                          Nossa IA pesquisa fontes confiáveis e estrutura o conteúdo
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 gradient-red rounded-full flex items-center justify-center flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Baixe o Arquivo</h4>
                        <p className="text-sm text-gray-400">
                          Receba seu seminário pronto em formato PPT ou Word
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-red-900">
                  <CardHeader>
                    <CardTitle className="text-white">Recursos Incluídos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-gray-400">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                        Estrutura acadêmica completa
                      </li>
                      <li className="flex items-start gap-2 text-gray-400">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                        Pesquisa em fontes confiáveis
                      </li>
                      <li className="flex items-start gap-2 text-gray-400">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                        Referências bibliográficas
                      </li>
                      <li className="flex items-start gap-2 text-gray-400">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                        Formatação profissional
                      </li>
                      <li className="flex items-start gap-2 text-gray-400">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                        Download imediato
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Chat Assistant Section */}
        {activeSection === 'chat' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-white">Assistente IA Educacional</h2>
              <p className="text-xl text-gray-400">Tire suas dúvidas e receba orientação personalizada</p>
            </div>

            <Card className="bg-gray-900 border-red-900 max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="text-red-500" />
                  Chat com IA
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Pergunte sobre qualquer disciplina, método de estudo ou orientação acadêmica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chat Messages */}
                <div className="bg-black rounded-lg p-6 min-h-96 max-h-96 overflow-y-auto space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 text-red-500" />
                      <p>Comece uma conversa! Faça sua primeira pergunta.</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-red-900 text-white'
                              : 'bg-gray-800 text-gray-200'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex gap-4">
                  <Input
                    placeholder="Digite sua pergunta..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                    className="bg-black border-red-900 text-white"
                    disabled={isGenerating}
                  />
                  <Button
                    onClick={handleChatSubmit}
                    disabled={isGenerating || !chatInput.trim()}
                    className="gradient-red"
                  >
                    {isGenerating ? <Clock className="animate-spin" /> : 'Enviar'}
                  </Button>
                </div>

                {/* Suggested Questions */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-400">Sugestões:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput('Como melhorar minha técnica de estudo?')}
                    className="border-red-900 hover:bg-red-900 text-xs"
                  >
                    Técnicas de estudo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput('Explique o conceito de fotossíntese')}
                    className="border-red-900 hover:bg-red-900 text-xs"
                  >
                    Conceitos de Biologia
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput('Como organizar meu tempo de estudo?')}
                    className="border-red-900 hover:bg-red-900 text-xs"
                  >
                    Organização
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Features */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-gray-900 border-red-900">
                <CardHeader>
                  <Quote className="w-8 h-8 text-red-500 mb-2" />
                  <CardTitle className="text-white text-lg">Gerador de Citações</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={citationStyle} onValueChange={setCitationStyle}>
                    <SelectTrigger className="bg-black border-red-900 text-white mb-4">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apa">APA</SelectItem>
                      <SelectItem value="mla">MLA</SelectItem>
                      <SelectItem value="chicago">Chicago</SelectItem>
                      <SelectItem value="abnt">ABNT</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    className="w-full border-red-900 hover:bg-red-900"
                    onClick={generateCitation}
                  >
                    Gerar Citação
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-red-900">
                <CardHeader>
                  <Library className="w-8 h-8 text-red-500 mb-2" />
                  <CardTitle className="text-white text-lg">Biblioteca Virtual</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">
                    Acesse milhares de artigos e livros acadêmicos
                  </p>
                  <Button variant="outline" className="w-full border-red-900 hover:bg-red-900">
                    Explorar
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-red-900">
                <CardHeader>
                  <Share2 className="w-8 h-8 text-red-500 mb-2" />
                  <CardTitle className="text-white text-lg">Partilhar Recursos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">
                    Compartilhe materiais com outros estudantes
                  </p>
                  <Button variant="outline" className="w-full border-red-900 hover:bg-red-900">
                    Partilhar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Calendar Section */}
        {activeSection === 'calendar' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-white">Calendário Acadêmico</h2>
              <p className="text-xl text-gray-400">Acompanhe datas importantes e organize seus estudos</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calendar View */}
              <Card className="lg:col-span-2 bg-gray-900 border-red-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Calendar className="text-red-500" />
                    {format(new Date(), 'MMMM yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black rounded-lg p-6">
                    {/* Simple Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 text-center mb-4">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                        <div key={day} className="text-gray-400 text-sm font-semibold py-2">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 35 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square flex items-center justify-center rounded hover:bg-red-900/20 cursor-pointer text-gray-300"
                        >
                          {i + 1 <= 31 ? i + 1 : ''}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Events List */}
              <Card className="bg-gray-900 border-red-900">
                <CardHeader>
                  <CardTitle className="text-white">Próximos Eventos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {calendarEvents.map((event, index) => (
                    <div
                      key={index}
                      className="bg-black rounded-lg p-4 border-l-4 border-red-500"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          event.type === 'exam' ? 'bg-red-900' :
                          event.type === 'deadline' ? 'bg-orange-900' :
                          'bg-blue-900'
                        }`}>
                          {event.type === 'exam' ? 'Exame' :
                           event.type === 'deadline' ? 'Prazo' : 'Teste'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {format(event.date, 'dd/MM')}
                        </span>
                      </div>
                      <p className="text-sm text-white">{event.title}</p>
                    </div>
                  ))}
                  <Button className="w-full gradient-red">
                    Adicionar Evento
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Study Groups */}
            <Card className="bg-gray-900 border-red-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="text-red-500" />
                  Grupos de Estudo
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Colabore com outros estudantes em projetos e trabalhos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-black border-red-900">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Matemática Avançada</CardTitle>
                      <CardDescription className="text-gray-400">12 membros</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full border-red-900 hover:bg-red-900">
                        Entrar
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-black border-red-900">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Biologia Celular</CardTitle>
                      <CardDescription className="text-gray-400">8 membros</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full border-red-900 hover:bg-red-900">
                        Entrar
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-black border-red-900">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Criar Novo Grupo</CardTitle>
                      <CardDescription className="text-gray-400">Comece a colaborar</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full gradient-red">
                        Criar Grupo
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-red-900 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Eric Dongo Academy</h3>
              <p className="text-gray-400 text-sm">
                Plataforma educacional gratuita com tecnologia IA para estudantes
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Links Rápidos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-red-500 cursor-pointer">Sobre Nós</li>
                <li className="hover:text-red-500 cursor-pointer">Disciplinas</li>
                <li className="hover:text-red-500 cursor-pointer">Recursos</li>
                <li className="hover:text-red-500 cursor-pointer">Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Suporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-red-500 cursor-pointer">FAQ</li>
                <li className="hover:text-red-500 cursor-pointer">Contato</li>
                <li className="hover:text-red-500 cursor-pointer">Privacidade</li>
                <li className="hover:text-red-500 cursor-pointer">Termos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-white">
                <Accessibility className="text-red-500" />
                Acessibilidade
              </h4>
              <p className="text-sm text-gray-400 mb-4">
                Plataforma totalmente acessível para todos os estudantes
              </p>
              <Button variant="outline" className="border-red-900 hover:bg-red-900">
                Configurações
              </Button>
            </div>
          </div>
          <div className="border-t border-red-900 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>2025 Eric Dongo Academy Hub. Todos os direitos reservados. Plataforma 100% gratuita.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
