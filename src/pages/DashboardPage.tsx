import { motion, AnimatePresence } from 'framer-motion';

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

import {
  Upload,
  Brain,
  Sparkles,
  HelpCircle,
  FileText,
  Clock,
  MoreVertical,
  Check,
  AlertCircle,
} from 'lucide-react';

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Sidebar } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { saveUploadedContent } from '@/hooks/useUploadedContent';



const recentUploads = [
  {
    id: 1,
    name: 'Biology Chapter 5 - Cell Division.pdf',
    date: '2 hours ago',
    status: 'Processed',
  },
  {
    id: 2,
    name: 'Chemistry - Organic Reactions.pdf',
    date: 'Yesterday',
    status: 'Processed',
  },
  {
    id: 3,
    name: 'Physics - Quantum Mechanics.pdf',
    date: '3 days ago',
    status: 'Processing',
  },
  {
    id: 4,
    name: 'Mathematics - Calculus Fundamentals.pdf',
    date: '1 week ago',
    status: 'Processed',
  },
];



const actionCards = [
  {
    icon: Brain,
    title: 'Explain Notes',
    description: 'Get detailed explanations of your study materials',
    href: '/response?type=explain',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Sparkles,
    title: 'Generate Summary',
    description: 'Transform lengthy notes into concise summaries',
    href: '/response?type=summary',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: HelpCircle,
    title: 'Generate Quiz',
    description: 'Test your knowledge with AI-generated quizzes',
    href: '/quiz',
    gradient: 'from-orange-500 to-red-500',
  },
];



const containerVariants = {
  hidden: { opacity: 0 },

  visible: {
    opacity: 1,

    transition: {
      staggerChildren: 0.1,
    },
  },
};



const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,
  },
};



// ✅ FIXED PDF TEXT EXTRACTION FUNCTION

async function extractTextFromFile(file: File): Promise<string> {


  // PDF FILE
  if (file.type === "application/pdf") {


    const arrayBuffer = await file.arrayBuffer();


    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;



    let extractedText = "";



    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {


      const page = await pdf.getPage(pageNumber);


      const textContent = await page.getTextContent();



      const pageText = textContent.items
        .map((item: any) => item.str || "")
        .join(" ");



      extractedText += pageText + "\n";

    }



    return extractedText;
  }



  // TXT FILE

  if (
    file.type === "text/plain" ||
    file.name.toLowerCase().endsWith(".txt")
  ) {

    return await file.text();

  }



  throw new Error(
    "Only PDF and TXT files are supported currently."
  );

}






export function DashboardPage() {


  const fileInputRef = useRef<HTMLInputElement>(null);



  const [uploadStatus, setUploadStatus] =
    useState<'idle' | 'success' | 'error'>('idle');



  const [uploadedFileName, setUploadedFileName] =
    useState<string | null>(null);



  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);




  const handleFileSelect = () => {

    fileInputRef.current?.click();

  };





  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {



    const file = e.target.files?.[0];

    if (!file) return;



    setUploadStatus('idle');

    setErrorMessage(null);




    const allowedTypes = [
      'application/pdf',
      'text/plain',
    ];



    if (
      !allowedTypes.includes(file.type)
      &&
      !file.name.endsWith('.txt')
    ) {


      setUploadStatus('error');

      setErrorMessage(
        'Please upload a PDF or TXT file.'
      );

      return;

    }





    if (file.size > 10 * 1024 * 1024) {


      setUploadStatus('error');

      setErrorMessage(
        'File size must be less than 10MB.'
      );

      return;

    }





    try {



      const content = await extractTextFromFile(file);




      if (!content || content.trim().length < 20) {


        throw new Error(
          "No readable text found in this file."
        );

      }




      // Save REAL PDF text for Groq AI

      saveUploadedContent(
        content,
        file.name
      );




      setUploadedFileName(file.name);

      setUploadStatus('success');




    } catch (error: any) {


      setUploadStatus('error');


      setErrorMessage(
        error.message ||
        "Failed to read file."
      );

    }




    if (fileInputRef.current) {

      fileInputRef.current.value = '';

    }


  };
    return (
    <div className="min-h-screen gradient-bg">

      <Sidebar />


      <main className="ml-72 p-8">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >


          <motion.div
            variants={itemVariants}
            className="mb-8"
          >

            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, Student!
            </h1>


            <p className="text-muted-foreground">
              Ready to supercharge your learning today?
            </p>

          </motion.div>





          <motion.div
            variants={itemVariants}
            className="mb-8"
          >

            <Card className="glass-card border-0 shadow-glass overflow-hidden group cursor-pointer">


              <CardContent className="p-0">


                <div className="relative">


                  <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />



                  <div
                    className="relative flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-border rounded-xl m-6 group-hover:border-primary transition-colors"
                    onClick={handleFileSelect}
                  >


                    <input

                      ref={fileInputRef}

                      type="file"

                      accept=".pdf,.txt"

                      onChange={handleFileChange}

                      className="hidden"

                    />



                    <div className="p-4 rounded-2xl gradient-primary mb-6 group-hover:scale-110 transition-transform">

                      <Upload className="h-8 w-8 text-white" />

                    </div>




                    <h3 className="text-xl font-semibold text-white mb-2">

                      Upload Your Study Notes

                    </h3>



                    <p className="text-muted-foreground text-center max-w-md mb-6">

                      Upload your PDF notes and AI will understand them

                    </p>




                    <Button

                      className="gradient-primary hover:gradient-primary-hover text-white font-semibold px-8 rounded-xl"

                      onClick={(e)=>{

                        e.stopPropagation();

                        handleFileSelect();

                      }}

                    >

                      Select Files

                    </Button>




                    <p className="text-xs text-muted-foreground mt-4">

                      Supports PDF and TXT up to 10MB

                    </p>



                  </div>


                </div>


              </CardContent>


            </Card>






            <AnimatePresence mode="wait">


              {
                uploadStatus === "success" && (

                  <motion.div

                    initial={{
                      opacity:0,
                      y:-10
                    }}

                    animate={{
                      opacity:1,
                      y:0
                    }}

                    className="mt-4"

                  >

                    <Alert className="bg-green-500/10 border-green-500/30">


                      <Check className="h-4 w-4 text-green-500"/>


                      <AlertDescription className="text-green-400">

                        Successfully uploaded:

                        <span className="font-medium ml-1">

                          {uploadedFileName}

                        </span>


                      </AlertDescription>


                    </Alert>


                  </motion.div>

                )

              }





              {
                uploadStatus === "error" && (

                  <motion.div

                    initial={{
                      opacity:0,
                      y:-10
                    }}

                    animate={{
                      opacity:1,
                      y:0
                    }}

                    className="mt-4"

                  >

                    <Alert
                      variant="destructive"
                      className="bg-red-500/10 border-red-500/30"
                    >

                      <AlertCircle className="h-4 w-4"/>


                      <AlertDescription className="text-red-400">

                        {errorMessage}

                      </AlertDescription>


                    </Alert>


                  </motion.div>

                )
              }


            </AnimatePresence>


          </motion.div>









          <motion.div variants={itemVariants}>


            <h2 className="text-xl font-semibold text-white mb-4">

              Quick Actions

            </h2>





            <div className="grid md:grid-cols-3 gap-6">


              {
                actionCards.map((action)=> (

                  <motion.div

                    key={action.title}

                    whileHover={{
                      y:-5,
                      scale:1.02
                    }}

                  >


                    <Link to={action.href}>


                      <Card className="glass-card border-0 shadow-glass h-full group cursor-pointer">


                        <CardContent className="p-6">


                          <div
                            className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.gradient} mb-4 group-hover:scale-110 transition-transform`}
                          >

                            <action.icon className="h-6 w-6 text-white"/>

                          </div>




                          <h3 className="text-lg font-semibold text-white mb-2">

                            {action.title}

                          </h3>




                          <p className="text-muted-foreground text-sm">

                            {action.description}

                          </p>



                        </CardContent>


                      </Card>


                    </Link>


                  </motion.div>


                ))
              }


            </div>


          </motion.div>









          <motion.div
            variants={itemVariants}
            className="mt-8"
          >



            <h2 className="text-xl font-semibold text-white mb-4">

              Recent Uploads

            </h2>





            <Card className="glass-card border-0 shadow-glass">


              <CardContent className="p-0">


                <div className="divide-y divide-border">


                {
                  recentUploads.map((upload)=>(


                    <div

                      key={upload.id}

                      className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"

                    >


                      <div className="flex items-center gap-4">


                        <div className="p-2 rounded-lg bg-muted">


                          <FileText className="h-5 w-5 text-muted-foreground"/>


                        </div>



                        <div>


                          <h4 className="font-medium text-white">

                            {upload.name}

                          </h4>



                          <div className="flex items-center gap-2 text-sm text-muted-foreground">


                            <Clock className="h-3 w-3"/>


                            <span>

                              {upload.date}

                            </span>


                          </div>


                        </div>


                      </div>





                      <div className="flex items-center gap-4">


                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            upload.status==="Processed"
                            ?
                            "bg-green-500/10 text-green-400"
                            :
                            "bg-yellow-500/10 text-yellow-400"
                          }`}
                        >

                          {upload.status}

                        </span>




                        <Button

                          variant="ghost"

                          size="icon"

                        >

                          <MoreVertical className="h-4 w-4 text-muted-foreground"/>


                        </Button>


                      </div>


                    </div>


                  ))
                }


                </div>


              </CardContent>


            </Card>



          </motion.div>



        </motion.div>


      </main>


    </div>
  );
}