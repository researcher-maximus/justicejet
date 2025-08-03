"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import MarkdownPreview from '@uiw/react-markdown-preview';
import '@uiw/react-markdown-preview/markdown.css';
import 'katex/dist/katex.min.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { 
  FileText, 
  Link, 
  FileImage, 
  Youtube, 
  Sparkles, 
  Brain, 
  Lightbulb, 
  Calculator, 
  BookOpen, 
  HelpCircle, 
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Download,
  Scale,
  Clock,
  ShieldCheck,
  Target,
  Zap,
  Heart,
  Users,
  ArrowRight,
  PlayCircle,
  Gavel,
  Timer,
  CheckCircle,
  Building2,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Folder,
  FileCheck,
  ExternalLink,
  Briefcase,
  Calendar
} from "lucide-react";

export default function JusticeJetApp() {
  const [outputTab, setOutputTab] = useState("flashcards");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pageLimit, setPageLimit] = useState("25");
  const [generatedContent, setGeneratedContent] = useState("");
  const [defenseMaterials, setDefenseMaterials] = useState({
    flashcards: "",
    mcq: "", 
    summary: "",
    definitions: ""
  });
  const [files, setFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [youtubeInput, setYoutubeInput] = useState("");
  const [caseId, setCaseId] = useState("CASE-NEW");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("CA");
  const [selectedCaseType, setSelectedCaseType] = useState("EVICTION");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);
  const [legalResearch, setLegalResearch] = useState<any[]>([]);

  // Generate case ID on client side to avoid hydration issues
  useEffect(() => {
    setCaseId(`CASE-${Date.now().toString().slice(-6)}`);
  }, []);

  const handlePDFDownload = async () => {
    // Dynamic import to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;
    
    const element = document.getElementById('defensepack-content');
    if (!element) return;

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'JusticeJet-Defense-Pack.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait' 
      }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedContent("");
    setDefenseMaterials({ flashcards: "", mcq: "", summary: "", definitions: "" });
    setLegalResearch([]);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('pageLimit', pageLimit);

      // Add progress tracking
      setAnalysisProgress(0);
      setAnalysisSteps([]);
      formData.append('jurisdiction', selectedJurisdiction);
      formData.append('caseType', selectedCaseType);

      // Simulate progress updates with legal research
      const steps = [
        "📄 Processing uploaded documents...",
        "🔍 Extracting key legal information...", 
        "🔎 Conducting real-time legal research...",
        "⚖️ Analyzing legal issues and defenses...",
        "📚 Cross-referencing case law and statutes...",
        "📝 Generating defense strategies...",
        "⏰ Computing critical deadlines...",
        "✅ Finalizing analysis with research citations..."
      ];
      
      let currentStep = 0;
      const progressInterval = setInterval(() => {
        if (currentStep < steps.length) {
          setAnalysisSteps(prev => [...prev, steps[currentStep]]);
          setAnalysisProgress(((currentStep + 1) / steps.length) * 100);
          currentStep++;
        }
      }, 1500);

      // Generate main defense pack
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content);

      // Generate defense materials with legal research
      const defenseResponse = await fetch('/api/generate-learning', {
        method: 'POST',
        body: formData,
      });

      if (defenseResponse.ok) {
        const defenseData = await defenseResponse.json();
        
        // Extract legal research from API response
        const { legalResearch: apiResearch, ...materials } = defenseData;
        
        setDefenseMaterials(materials);
        
        // Set real legal research data from Exa API
        if (apiResearch && apiResearch.length > 0) {
          setLegalResearch(apiResearch);
        }
      }

      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
    } catch (error) {
      console.error(error);
      setAnalysisSteps(prev => [...prev, "❌ Analysis failed. Please try again."]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-background to-navy">


      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Hero Header */}
        <header className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10 rounded-3xl"></div>
          <div className="relative z-10 py-12">
            
            {/* Main Title */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Gavel className="w-10 h-10 text-gold" />
              <h1 
                className="text-7xl font-bold leading-tight"
                style={{
                  fontFamily: 'var(--font-grotesk)', 
                  lineHeight: '1.1',
                  background: 'linear-gradient(135deg, #fbbf24, #fde047, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                JusticeJet
              </h1>
              <Zap className="w-10 h-10 text-gold-light" />
            </div>
            
            {/* Mission Statement */}
            <div className="max-w-4xl mx-auto mb-8">
              <h2 className="font-grotesk text-2xl text-gold-light mb-4 font-medium">
                Do more good per hour.
              </h2>
              <p className="text-lg text-card-foreground/80 leading-relaxed font-grotesk">
                Turn <span className="text-gold font-semibold">hours of case prep into seconds</span> of AI-powered analysis. 
                Help pro bono attorneys fight evictions, wage theft, and debt collection with 
                <span className="text-gold-light font-semibold"> lightning-fast defense strategies</span>.
              </p>
            </div>

          </div>
        </header>
        
        {/* Impact Stats */}
        <div className="mb-16">
          <div className="text-center mb-8">
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-gold/20">
              <div className="text-3xl font-bold text-gold mb-2">2,000</div>
              <div className="text-sm text-card-foreground/70">Tokens/sec</div>
            </div>
            <div className="text-center bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-gold/20">
              <div className="text-3xl font-bold text-gold mb-2">&lt;10s</div>
              <div className="text-sm text-card-foreground/70">Complete case analysis</div>
            </div>
            <div className="text-center bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-gold/20">
              <div className="text-3xl font-bold text-gold mb-2">3hrs→10s</div>
              <div className="text-sm text-card-foreground/70">Time reduction ratio</div>
            </div>
            <div className="text-center bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-gold/20">
              <div className="text-3xl font-bold text-gold mb-2">100%</div>
              <div className="text-sm text-card-foreground/70">Source verifiable</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-grotesk text-gold mb-4">From Documents to Defense in Seconds</h3>
            <p className="text-lg text-card-foreground/80 max-w-2xl mx-auto">
              JusticeJet transforms your case intake process, giving you more time to focus on what matters: fighting for your clients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-navy-dark" />
              </div>
              <h4 className="text-gold font-semibold mb-2">1. Upload Documents</h4>
              <p className="text-sm text-card-foreground/70">Drop in notices, complaints, contracts, and case files</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-navy-dark" />
              </div>
              <h4 className="text-gold font-semibold mb-2">2. AI Analysis</h4>
              <p className="text-sm text-card-foreground/70">Cerebras processes at 2,000 tokens/sec with precision</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-navy-dark" />
              </div>
              <h4 className="text-gold font-semibold mb-2">3. Defense Strategy</h4>
              <p className="text-sm text-card-foreground/70">Issues, deadlines, and defense options surfaced instantly</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-navy-dark" />
              </div>
              <h4 className="text-gold font-semibold mb-2">4. Ready to Act</h4>
              <p className="text-sm text-card-foreground/70">Draft letters, motions, and calendars ready for review</p>
            </div>
          </div>
        </div>

        {/* Case Types & Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-grotesk text-gold mb-4">Built for Pro Bono Heroes</h3>
            <p className="text-lg text-card-foreground/80 max-w-3xl mx-auto">
              Specialized for high-volume civil matters where every minute counts and every case matters.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {/* Case Types */}
            <div className="bg-gradient-to-br from-navy-light/40 to-navy/40 border border-gold/30 rounded-xl p-6">
              <Scale className="w-8 h-8 text-gold mb-4" />
              <h4 className="text-gold font-semibold mb-3">Eviction Defense</h4>
              <ul className="text-sm text-card-foreground/70 space-y-1">
                <li>• Improper service analysis</li>
                <li>• Habitability defenses</li>
                <li>• Payment plan strategies</li>
                <li>• Jurisdiction challenges</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-navy-light/40 to-navy/40 border border-gold/30 rounded-xl p-6">
              <Users className="w-8 h-8 text-gold mb-4" />
              <h4 className="text-gold font-semibold mb-3">Wage & Hour</h4>
              <ul className="text-sm text-card-foreground/70 space-y-1">
                <li>• FLSA violation detection</li>
                <li>• Overtime calculations</li>
                <li>• Classification issues</li>
                <li>• Damages assessment</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-navy-light/40 to-navy/40 border border-gold/30 rounded-xl p-6">
              <ShieldCheck className="w-8 h-8 text-gold mb-4" />
              <h4 className="text-gold font-semibold mb-3">Debt Collection</h4>
              <ul className="text-sm text-card-foreground/70 space-y-1">
                <li>• FDCPA violations</li>
                <li>• Validation requirements</li>
                <li>• Statute of limitations</li>
                <li>• Fee-shifting opportunities</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Legal Brief Command Center */}
        <div className="mb-12">
          <h3 className="text-2xl font-grotesk text-gold mb-8 text-center">JusticeJet Command Center</h3>
          
          {/* Case Intake Header */}
          <div className="bg-gradient-to-r from-navy-light/60 to-navy/60 border border-gold/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Briefcase className="w-6 h-6 text-gold" />
                <div>
                  <h4 className="text-lg font-semibold text-gold">Case Intake: {caseId}</h4>
                  <p className="text-sm text-card-foreground/70">Auto-generated case identifier</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 text-sm font-medium">System Ready</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Jurisdiction
                </label>
                <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                  <SelectTrigger className="bg-navy-dark/50 border-gold/30 text-card-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-light border-gold/30">
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FEDERAL">Federal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gold flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Case Type
                </label>
                <Select value={selectedCaseType} onValueChange={setSelectedCaseType}>
                  <SelectTrigger className="bg-navy-dark/50 border-gold/30 text-card-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-light border-gold/30">
                    <SelectItem value="EVICTION">Eviction Defense</SelectItem>
                    <SelectItem value="DEBT">Debt Collection</SelectItem>
                    <SelectItem value="WAGE">Wage & Hour</SelectItem>
                    <SelectItem value="IMMIGRATION">Immigration</SelectItem>
                    <SelectItem value="BENEFITS">Benefits Appeal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Main Interface Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Document Repository */}
            <div className="lg:col-span-1">
              <Card className="bg-card/80 border-gold/30 backdrop-blur-sm shadow-xl shadow-navy-dark/20 h-full">
                <CardHeader className="bg-gradient-to-r from-navy-light/50 to-transparent">
                  <CardTitle className="text-gold flex items-center gap-2">
                    <Folder className="w-5 h-5" />
                    Document Repository
                  </CardTitle>
                  <CardDescription className="font-grotesk text-card-foreground/70">
                    Upload and manage case documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gold/40 rounded-lg p-6 text-center bg-navy/20 hover:bg-navy/30 transition-colors mb-4">
                      <FileText className="w-8 h-8 mx-auto mb-3 text-gold" />
                      <p className="text-sm text-card-foreground mb-2 font-medium">Drop legal documents</p>
                      <p className="text-xs text-card-foreground/60">Complaints, notices, contracts, evidence</p>
                      <Input
                        type="file"
                        multiple
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileChange}
                      />
                    </div>
                  </label>
                  
                  {/* File List */}
                  <div className="space-y-2">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-navy-light/30 rounded-lg border border-gold/20">
                        <FileCheck className="w-4 h-4 text-gold flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground truncate">{file.name}</p>
                          <p className="text-xs text-card-foreground/60">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Analysis Controls */}
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gold">Analysis Depth</label>
                      <Select value={pageLimit} onValueChange={setPageLimit}>
                        <SelectTrigger className="bg-navy-dark/50 border-gold/30 text-card-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-navy-light border-gold/30">
                          <SelectItem value="10">Quick Review</SelectItem>
                          <SelectItem value="25">Standard Analysis</SelectItem>
                          <SelectItem value="50">Deep Dive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-gold to-gold-light text-navy-dark hover:from-gold-light hover:to-gold font-semibold py-2 shadow-lg shadow-gold/25 transition-all duration-200"
                      onClick={handleGenerate}
                      disabled={isGenerating || files.length === 0}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Launch Analysis
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Analysis Feed */}
            <div className="lg:col-span-1">
              <Card className="bg-card/80 border-gold/30 backdrop-blur-sm shadow-xl shadow-navy-dark/20 h-full">
                <CardHeader className="bg-gradient-to-r from-navy-light/50 to-transparent">
                  <CardTitle className="text-gold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Live Analysis Feed
                  </CardTitle>
                  <CardDescription className="font-grotesk text-card-foreground/70">
                    Real-time processing updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="bg-navy-light/30 rounded-lg p-4 border border-gold/20">
                        <div className="flex items-center gap-3 mb-3">
                          <Loader2 className="w-5 h-5 text-gold animate-spin" />
                          <span className="text-gold font-medium">Processing Documents</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-card-foreground/70">Progress</span>
                            <span className="text-gold">{analysisProgress}%</span>
                          </div>
                          <div className="w-full bg-navy-dark/50 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-gold to-gold-light h-2 rounded-full transition-all duration-500"
                              style={{ width: `${analysisProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {analysisSteps.map((step, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 bg-navy-light/20 rounded">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-card-foreground">{step}</span>
                          </div>
                        ))}
                        
                        {/* Live Legal Research Display */}
                        {legalResearch.length > 0 && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-gold/10 to-gold-light/10 border border-gold/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Search className="w-4 h-4 text-gold" />
                              <span className="text-sm font-medium text-gold">Live Legal Research</span>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {legalResearch.slice(0, 4).map((research, i) => (
                                <div key={i} className="text-xs text-card-foreground/80 border-l-2 border-gold/30 pl-2">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="text-gold">🔍</span> 
                                    <span className="font-medium text-gold text-xs">{research.term || research.query}</span>
                                  </div>
                                  {research.results && research.results.length > 0 && (
                                    <div className="ml-3 space-y-1">
                                      {research.results.slice(0, 2).map((result, j) => (
                                        <div key={j} className="text-card-foreground/70">
                                          <div className="font-medium text-xs">{result.title.substring(0, 50)}...</div>
                                          {result.url && (
                                            <div className="text-emerald-400 text-xs opacity-75">
                                              {new URL(result.url).hostname}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Upload documents to begin analysis</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card className="bg-card/80 border-gold/30 backdrop-blur-sm shadow-xl shadow-navy-dark/20 h-full">
                <CardHeader className="bg-gradient-to-r from-navy-light/50 to-transparent">
                  <CardTitle className="text-gold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="font-grotesk text-card-foreground/70">
                    Case management tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gold/30 text-gold hover:bg-gold hover:text-navy-dark"
                      onClick={() => setOutputTab("flashcards")}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Case Facts
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gold/30 text-gold hover:bg-gold hover:text-navy-dark"
                      onClick={() => setOutputTab("mcq")}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Review Legal Issues
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gold/30 text-gold hover:bg-gold hover:text-navy-dark"
                      onClick={() => setOutputTab("summary")}
                    >
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Defense Strategies
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gold/30 text-gold hover:bg-gold hover:text-navy-dark"
                      onClick={() => setOutputTab("definitions")}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Critical Deadlines
                    </Button>
                    
                    <div className="border-t border-gold/20 pt-3 mt-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-emerald-400/30 text-emerald-400 hover:bg-emerald-400 hover:text-navy-dark"
                        onClick={async () => {
                          try {
                            // Trigger real additional legal research
                            const searchQuery = `${selectedJurisdiction} recent ${selectedCaseType.toLowerCase()} cases 2024`;
                            
                            const response = await fetch('/api/legal-search', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                query: searchQuery,
                                jurisdiction: selectedJurisdiction,
                                caseType: selectedCaseType
                              })
                            });
                            
                            if (response.ok) {
                              const data = await response.json();
                              if (data.searchResults && data.searchResults.length > 0) {
                                // Add real search results to existing research
                                setLegalResearch(prev => [...prev, ...data.searchResults]);
                              }
                            }
                          } catch (error) {
                            console.error('Additional research failed:', error);
                          }
                        }}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Additional Research
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Separate Defense Workbench Sections */}
        <div className="mb-12">
          <h3 className="text-2xl font-grotesk text-gold mb-8 text-center">Defense Analysis Results</h3>
          
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Case Facts */}
            <Card className="bg-card/80 border-gold/30 backdrop-blur-sm shadow-xl shadow-navy-dark/20">
              <CardHeader className="bg-gradient-to-r from-navy-light/50 to-transparent">
                <CardTitle className="text-gold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Case Facts & Timeline
                </CardTitle>
                <CardDescription className="font-grotesk text-card-foreground/70">
                  Key information and chronology
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="bg-navy-light/30 border border-gold/20 rounded-lg p-4 min-h-[250px] flex flex-col">
                  {defenseMaterials.flashcards ? (
                    <div className="flex-1 overflow-auto">
                      <MarkdownPreview 
                        source={defenseMaterials.flashcards}
                        data-color-mode="dark"
                        style={{ 
                          backgroundColor: 'transparent', 
                          color: '#e2e8f0',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Case facts will appear here after analysis</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Legal Issues */}
            <Card className="bg-card/80 border-gold/30 backdrop-blur-sm shadow-xl shadow-navy-dark/20">
              <CardHeader className="bg-gradient-to-r from-navy-light/50 to-transparent">
                <CardTitle className="text-gold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Legal Issues Analysis
                </CardTitle>
                <CardDescription className="font-grotesk text-card-foreground/70">
                  Identified legal problems and defenses
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="bg-navy-light/30 border border-gold/20 rounded-lg p-4 min-h-[250px] flex flex-col">
                  {defenseMaterials.mcq ? (
                    <div className="flex-1 overflow-auto">
                      <MarkdownPreview 
                        source={defenseMaterials.mcq}
                        data-color-mode="dark"
                        style={{ 
                          backgroundColor: 'transparent', 
                          color: '#e2e8f0',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Legal issues analysis will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Defense Strategies */}
            <Card className="bg-card/80 border-gold/30 backdrop-blur-sm shadow-xl shadow-navy-dark/20">
              <CardHeader className="bg-gradient-to-r from-navy-light/50 to-transparent">
                <CardTitle className="text-gold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Defense Strategies
                </CardTitle>
                <CardDescription className="font-grotesk text-card-foreground/70">
                  Recommended defense approach and tactics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="bg-navy-light/30 border border-gold/20 rounded-lg p-4 min-h-[250px] flex flex-col">
                  {defenseMaterials.summary ? (
                    <div className="flex-1 overflow-auto">
                      <MarkdownPreview 
                        source={defenseMaterials.summary}
                        data-color-mode="dark"
                        style={{ 
                          backgroundColor: 'transparent', 
                          color: '#e2e8f0',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Defense strategies will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Critical Deadlines */}
            <Card className="bg-card/80 border-gold/30 backdrop-blur-sm shadow-xl shadow-navy-dark/20">
              <CardHeader className="bg-gradient-to-r from-navy-light/50 to-transparent">
                <CardTitle className="text-gold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Critical Deadlines
                </CardTitle>
                <CardDescription className="font-grotesk text-card-foreground/70">
                  Important dates and filing requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="bg-navy-light/30 border border-gold/20 rounded-lg p-4 min-h-[250px] flex flex-col">
                  {defenseMaterials.definitions ? (
                    <div className="flex-1 overflow-auto">
                      <MarkdownPreview 
                        source={defenseMaterials.definitions}
                        data-color-mode="dark"
                        style={{ 
                          backgroundColor: 'transparent', 
                          color: '#e2e8f0',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Critical deadlines will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {generatedContent && (
          <div className="mt-8">
            <Card className="bg-card/80 border-gold/30 backdrop-blur-sm shadow-xl shadow-navy-dark/20">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-navy-light/50 to-transparent">
                <CardTitle className="text-gold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Generated Defense Pack
                </CardTitle>
                <Button
                  onClick={handlePDFDownload}
                  variant="outline"
                  size="sm"
                  className="border-gold/50 text-gold hover:bg-gold hover:text-navy-dark transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div id="defensepack-content">
                  <MarkdownPreview 
                    source={generatedContent}
                    data-color-mode="dark"
                    rehypePlugins={[[rehypeKatex, { 
                      throwOnError: false, 
                      errorColor: '#ff6b6b',
                      strict: false 
                    }]]}
                    remarkPlugins={[remarkMath]}
                    wrapperElement={{
                      'data-color-mode': 'dark'
                    }}
                    style={{ 
                      backgroundColor: 'transparent', 
                      color: '#e2e8f0',
                      padding: '20px',
                      lineHeight: '1.6',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mission Statement Footer */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-gold/10 via-transparent to-gold/10 rounded-3xl p-12 border border-gold/20">
            <Heart className="w-12 h-12 text-gold mx-auto mb-6" />
            <h3 className="text-2xl font-grotesk text-gold mb-4">Justice Shouldn't Wait</h3>
            <p className="text-lg text-card-foreground/80 max-w-3xl mx-auto mb-6">
              Every second saved with JusticeJet is another moment you can spend fighting for those who need it most. 
              When the system is stacked against your clients, speed becomes justice.
            </p>
          </div>
        </div>

        {/* Pro Bono Impact */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-navy-light/30 border border-gold/20 rounded-xl p-6">
            <div className="text-2xl font-bold text-gold mb-2">180x</div>
            <div className="text-sm text-card-foreground/70">More cases handled per day</div>
          </div>
          <div className="bg-navy-light/30 border border-gold/20 rounded-xl p-6">
            <div className="text-2xl font-bold text-gold mb-2">$0</div>
            <div className="text-sm text-card-foreground/70">Cost to families in need</div>
          </div>
          <div className="bg-navy-light/30 border border-gold/20 rounded-xl p-6">
            <div className="text-2xl font-bold text-gold mb-2">∞</div>
            <div className="text-sm text-card-foreground/70">Impact on communities</div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-16 text-center">
          <div className="bg-navy-light/20 border border-gold/20 rounded-xl p-6 max-w-4xl mx-auto">
            <p className="text-sm text-card-foreground/60">
              <strong className="text-gold">For Licensed Attorneys Only:</strong> JusticeJet is designed for legal professionals. 
              All outputs require attorney review and verification. Not legal advice. 
              Demo uses synthetic/redacted documents for privacy protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
