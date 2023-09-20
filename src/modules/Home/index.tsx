import { useEffect, useState, useRef } from 'react';
import {Box, Button, Container, Drawer, IconButton, Grid, Typography} from "@mui/material";
import Appbar from "../components/Appbar";
import { amber } from "@mui/material/colors";
import { Editor } from "@monaco-editor/react";
import {BugReport, Close, DirectionsRun, PrecisionManufacturing, RunCircle, SmartToy} from "@mui/icons-material";
import axios, { AxiosResponse } from "axios";
import { toast } from 'react-toastify';
import MutationTable from "../components/Tables";

const ApiContent = ({ content }: any) => {
    // Split the content into an array of lines
    const lines = content.split('\r\n');

    return (
        <div>
            {lines.map((line: any, index: any) => (
                <pre
                    key={index}
                    style={{
                        lineHeight: '12px',
                        fontSize: '16px'
                    }}>
                    {line}
                </pre>
            ))}
        </div>
    );
};


export default function Home() {

    const samplesRef = useRef<HTMLDivElement | any>(null);
    const [instances, setInstances] = useState<any[]>([]);

    function createInstance() {
        setInstances([...instances, `
            /* 
                @author: satoshi 
                @description: create a nice description for the method
                @created_at: ${new Date().toLocaleDateString()}
            */
        `])
    }

    const [openPitest, setOpenPitest] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<any>("");
    const [testsOutput, setTestsOutput] = useState<any>("");

    const buildCode = async () => {
        await axios.post('http://localhost:5500/completitions/build-and-run')
            .then((res: AxiosResponse<any>) => {
                toast.info(res.data)
            })
            .catch((err) => { })
            .finally(() => {
                toast.info('Build request ended')
            })
    }

    const getOutput = async () => {
        await axios.get('http://localhost:5500/completitions/retrieve')
            .then((res: AxiosResponse<any>) => {
                // setOutput(res.data.content)
                if(res.data.content) {
                    const startIndex = res.data.content.indexOf(' T E S T S')
                    const endIndex = res.data.content.indexOf('[INFO] -----------------------------------------------------------------------')

                    const sliceString = res.data.content.slice(startIndex, endIndex)
                    // setOutput(res.data.content)
                    setTestsOutput(sliceString.replace(' T E S T S', 'Tests:'))
                }
            })
            .catch((err) => {
                setOutput('Falha ao consultar o terminal')
            })
            .finally(() => {
                toast.info('Terminal query ended')
            })

    }

    const getPitOutput = async () => {
        await axios.get('http://localhost:5500/completitions/retrieve-pit')
            .then((res: AxiosResponse<any>) => {
                setOutput(res.data.mutations.mutation)
                setOpenPitest(true)

            })
            .catch((err) => {
                console.log(err)
                setOutput('Falha ao consultar o terminal')
            })
            .finally(() => {
                toast.info('Pit query ended')
            })

    }

    const getContents = async () => {
        await axios.get('http://localhost:5500/completitions/contents')
            .then((res: AxiosResponse<any>) => {
                setInput(res.data)
            })
            .catch((err) => {
                setOutput('Falha ao consultar o arquivo')
            })
    }

    const submitTestSuit = async () => {
        await axios.post('http://localhost:5500/completitions/write-to-file', {
            textContent: input
        })
            .then((res: AxiosResponse<any>) => {
                setInput(res.data)
            })
            .catch((err) => {
                setOutput('Falha ao escrever no arquivo')
            })
    }

    useEffect(() => {
        getContents()
    }, [])
    return (
        <>
            {/* <Appbar /> */}
            <Container sx={{
                minHeight: '100vh',
                paddingBottom: '20vh'
            }}>
                <Box mt={3} mb={3} sx={{display: 'none'}}>
                    <Typography variant="h1">Sentinel</Typography>
                    <Typography variant="h1">Test Agains Mutants</Typography>
                    <Typography variant="h5">Tryout a sample and learn by example</Typography>
                </Box>

                <Grid container sx={{mt: 3}}>
                    <Grid item md={12}>
                        <Box sx={{
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                bgcolor: amber['A400'],
                                padding: '12px 24px',
                                borderTopRightRadius: '12px',
                                borderTopLeftRadius: '12px',
                            }}>
                                <Typography variant="h5">This is a statement, it explains what is our
                                    target</Typography>
                            </Box>
                            <Box
                                sx={{
                                    padding: '12px 24px',
                                    border: 'solid thin #ddd',
                                }}>
                                <Box mb={3} mt={3}>
                                    <Typography variant="body1">
                                        Here comes the text and the prompt. It might present you a nice slice of code
                                        that should be evolved
                                    </Typography>
                                </Box>

                                <Box>
                                    <Box mb={2} display='flex' gap={1}>
                                        <Button variant="outlined" startIcon={<PrecisionManufacturing/>}
                                                onClick={createInstance}>Generate</Button>
                                        <Button variant="outlined" startIcon={<DirectionsRun/>}
                                                onClick={submitTestSuit}>Submit</Button>
                                        <Button variant="outlined" startIcon={<BugReport/>} onClick={buildCode}>Run
                                            code</Button>
                                        <Button variant="outlined" startIcon={<DirectionsRun/>}
                                                onClick={getOutput}>Terminal</Button>
                                        <Button variant="outlined" startIcon={<SmartToy/>}
                                                onClick={getPitOutput}>Pitest</Button>
                                    </Box>
                                    <Editor
                                        height="35vh"
                                        theme="vs-light"
                                        defaultLanguage="java"
                                        defaultValue={input !== "" ? input :
                                            `
package com.santos;

import javax.swing.*;
import java.awt.Dimension;

public class Calculator {
    public Calculator() {}

    public float somar(float a, float b) {
        return a + b;
    }

    public void mountWindow() {
        JFrame frame = new JFrame();
        frame.setSize(new Dimension(500, 400));
        frame.setVisible(true);
    }
}
                    `
                                        }
                                        onChange={(e) => {
                                            console.log(e)
                                            if (e)
                                                setInput(e)
                                        }}
                                    />

                                    <Box mt={3} mb={2}>
                                        <Typography variant={"h5"}>Novas Instâncias</Typography>
                                    </Box>
                                    <Box ref={samplesRef}>
                                        {
                                            instances.map((instance: string) => {
                                                return <Editor height="35vh"
                                                               theme="vs-light"
                                                               defaultLanguage="java"
                                                               defaultValue={instance}/>
                                            })
                                        }
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{
                                backgroundColor: '#081B4B',
                                minHeight: '20vh',
                                color: 'white',
                                padding: '12px 24px',
                                borderBottomLeftRadius: '12px',
                                borderBottomRightRadius: '12px',
                            }}>
                                <ApiContent content={testsOutput}/>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <Drawer anchor={'bottom'} open={openPitest}>
                <Box mt={3} mb={3} p={2} sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <Box>
                        <Typography variant={"h5"}>Sumário</Typography>
                        <Typography variant={"body1"}>Listando sumário com mutantes vivos e mortos</Typography>
                    </Box>
                    <Box>
                        <IconButton
                            onClick={() => {
                                setOpenPitest(false)
                            }}>
                            <Close/>
                        </IconButton>
                    </Box>
                </Box>
                <Box
                    p={2}
                    sx={{
                        minHeight: "10vh"
                    }}>
                    <Typography variant={"h2"}>
                        {
                            output && output.filter((mutation: any) => mutation.$.status === 'KILLED').length + "/" + output.length
                        }
                    </Typography>
                </Box>
                <Box p={2}>
                    <Typography variant={"h5"}>Sumário detalhado</Typography>
                    <Typography variant={"body1"}>Veja os detalhes da execução</Typography>
                </Box>
                <Box
                    sx={{
                        minHeight: "20vh", marginBottom: "10vh", overflow: "hidden", overflowX: "scroll",
                        paddingBottom: "48px"
                }}>
                    <MutationTable mutations={output}/>
                </Box>
            </Drawer>
        </>
    );
}