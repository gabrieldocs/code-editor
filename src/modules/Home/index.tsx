import { useEffect, useState, useRef } from 'react';
import { Box, Button, Container, Drawer, IconButton, Grid, Typography, Chip, InputAdornment, FormControl, TextField } from "@mui/material";
import Appbar from "../components/Appbar";
import { amber } from "@mui/material/colors";
import { Editor } from "@monaco-editor/react";
import {
    BugReport, Build,
    ChevronLeft,
    ChevronRight,
    Close,
    DirectionsRun,
    LiveHelp,
    PrecisionManufacturing,
    RunCircle,
    Search,
    SmartToy,
    Upload
} from "@mui/icons-material";
import axios, { AxiosResponse } from "axios";
import { toast } from 'react-toastify';
import MutationTable from "../components/Tables";
import Confetti from 'react-confetti'
import MutationTableComponent from '../components/Tables';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import FileTree from "react-file-treeview";


const TreeView = () => {
    //create tree data*
    const data = {
        name: "treeview",
        id: 1,
        toggled: true,
        child: [
            {
                name: "folder1",
                id: 2,
                child: [
                    {
                        name: "folder2",
                        id: 5,
                        child: [
                            { name: "file3.py", id: 6, child: [] },
                            { name: "file4.cpp", id: 7, child: [] },
                        ],
                    },
                    { name: "file1.js", id: 3, child: [] },
                    { name: "file2.ts", id: 4, child: [] },
                ],
            },
        ],
    };

    //create Collapse button data
    const [collapseAll, setCollapseAll] = useState(false);
    const handleCollapseAll = (value: any) => setCollapseAll(value);

    //Create file action data*
    const handleFileOnClick = (file: any) => {
        console.log(file);
    };

    const action = {
        fileOnClick: handleFileOnClick,
    };

    //Create Decoration data*
    const treeDecorator = {
        showIcon: true,
        iconSize: 18,
        textSize: 15,
        showCollapseAll: true,
    };
    return <FileTree
        data={data}
        action={action} //optional
        collapseAll={{ collapseAll, handleCollapseAll }} //Optional
        decorator={treeDecorator} //Optional
    />
}

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

// const BASE_URL = 'https://api.santosworkers.com'
const BASE_URL = 'http://localhost:5500'


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

    const [testRun, setTestRun] = useState(0);
    const [failures, setFailures] = useState(0);
    const [errors, setErrors] = useState(0);


    const buildCode = async () => {
        await axios.post(BASE_URL + '/completitions/build-and-run')
            .then((res: AxiosResponse<any>) => {
                toast.info(res.data)
            })
            .catch((err) => { })
            .finally(() => {
                toast.success('Build request ended')
            })
    }

    const getOutput = async () => {
        await axios.get(BASE_URL + '/completitions/retrieve')
            .then((res: AxiosResponse<any>) => {
                // setOutput(res.data.content)
                if (res.data.content) {
                    const startIndex = res.data.content.indexOf(' T E S T S')
                    const endIndex = res.data.content.indexOf('[INFO] -----------------------------------------------------------------------')

                    const sliceString = res.data.content.slice(startIndex, endIndex)
                    // setOutput(res.data.content)
                    setTestsOutput(sliceString.replace(' T E S T S', 'Tests:'))

                    // Split the response into lines
                    const lines = sliceString.split('\n');
                    // Regular expressions to match relevant lines
                    const testsRunRegex = /Tests run: (\d+),/;
                    const failuresRegex = /Failures: (\d+),/;
                    const errorsRegex = /Errors: (\d+),/;

                    lines.forEach((line: any) => {
                        const testRunMatch = testsRunRegex.exec(line);
                        if (testRunMatch) {
                            setTestRun(parseInt(testRunMatch[1], 10));
                        }

                        const failuresMatch = failuresRegex.exec(line);
                        if (failuresMatch) {
                            setFailures(parseInt(failuresMatch[1], 10));
                        }

                        const errorsMatch = errorsRegex.exec(line);
                        if (errorsMatch) {
                            setErrors(parseInt(errorsMatch[1], 10));
                        }
                    });
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
        await axios.get(BASE_URL + '/completitions/retrieve-pit')
            .then((res: AxiosResponse<any>) => {
                setOutput(res.data)
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

    const getContents = async (path?: string) => {
        await axios.get(BASE_URL + '/completitions/contents', {
            params: {
                filePath: path ?? './public/unzipped/1693959366583_sample/sample/src/test/java/com/example/CalculatorTest.java'
            }
        })
            .then((res: AxiosResponse<any>) => {
                setInput(res.data)
            })
            .catch((err) => {
                setOutput('Falha ao consultar o arquivo')
            })
    }

    const submitTestSuit = async () => {
        await axios.post(BASE_URL + '/completitions/write-to-file', {
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
            {
                openPitest
                    ? <Confetti width={window.innerWidth} height={window.innerHeight} />
                    : <></>
            }
            {/* <Appbar /> */}
            <Grid container>
                <Grid item md={3}
                    sx={{
                        backgroundColor: "#f0f9ff"
                    }}>
                    <Box p={3}>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "12px"
                        }}>
                            <IconButton size="small"><ChevronLeft /> </IconButton>
                            <Typography variant="h5"><strong>Demo issue</strong></Typography>
                        </Box>

                        <Box m={1}
                            sx={{
                                display: 'flex',
                                gap: '12px',
                                flexWrap: 'wrap'
                            }}>
                            <Chip label="CalculatorTest.java" />
                            <Chip label="Calculator.java"
                                onClick={async () => {
                                    await getContents('./public/unzipped/1693959366583_sample/sample/src/main/java/com/example/Calculator.java')
                                }} />
                            <Chip label="Calculator2Test.java" />
                        </Box>
                        <Box mb={3} mt={3}>

                            <Typography variant="body1"
                                sx={{
                                    marginBottom: "18px"
                                }}>
                                Welcome to the world of Java! In this challenge, we practice printing to stdout.
                            </Typography>
                            <Typography variant="body1"
                                sx={{
                                    marginBottom: "18px"
                                }}>
                                The code stubs in your editor declare a Solution class and a main method. Complete the main method by copying the two lines of code below and pasting them inside the body of your main method.
                            </Typography>
                        </Box>
                        <Button variant="contained" disableElevation endIcon={<LiveHelp />}>Dicas</Button>
                    </Box>

                    <Box>
                    <TreeView />
                    </Box>
                </Grid>
                <Grid item md={9}>
                    <Container sx={{
                        minHeight: 'calc(100vh - 96px)',
                        // paddingBottom: '10vh'
                    }}>
                        <Box mt={3} mb={3} sx={{ display: 'none' }}>
                            <Typography variant="h1">Sentinel</Typography>
                            <Typography variant="h1">Test Agains Mutants</Typography>
                            <Typography variant="h5">Tryout a sample and learn by example</Typography>
                        </Box>

                        <Grid container sx={{ mt: 3 }}>
                            <Grid item md={12}>
                                <Box sx={{
                                    overflow: 'hidden'
                                }}>
                                    <Box sx={{
                                        bgcolor: amber['A400'],
                                        padding: '12px 24px',
                                        borderTopRightRadius: '12px',
                                        borderTopLeftRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <IconButton
                                            sx={{
                                                border: 'solid white thin'
                                            }}>
                                            <ChevronLeft />
                                        </IconButton>
                                        <Typography variant="body1">
                                            <strong>
                                                Classe CalculatorTest.java
                                            </strong>
                                        </Typography>

                                        <IconButton>
                                            <ChevronRight />
                                        </IconButton>
                                    </Box>
                                    <Box
                                        sx={{
                                            padding: '12px 24px',
                                            border: 'solid thin #ddd',
                                        }}>
                                        <Box mb={3} mt={3}>
                                            <Typography variant="body1">
                                                Edite o código abaixo para inserir novos casos de teste ou editar os testes existentes.
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Box mb={2} display='flex' gap={1}>
                                                {/*<Button variant="outlined" startIcon={<PrecisionManufacturing/>}*/}
                                                {/*        onClick={createInstance}>Generate</Button>*/}
                                                <Button variant="outlined" startIcon={<Upload />}
                                                    onClick={submitTestSuit}>Submit</Button>
                                                <Button variant="outlined" startIcon={<Build />} onClick={buildCode}>Run
                                                    code</Button>
                                                <Button variant="outlined" startIcon={<DirectionsRun />}
                                                    onClick={getOutput}>Terminal JUnit</Button>
                                                <Button variant="outlined" startIcon={<SmartToy />}
                                                    onClick={getPitOutput}>Pitest</Button>
                                            </Box>
                                            <Editor
                                                height="35vh"
                                                theme="vs-dark"
                                                defaultLanguage="java"
                                                value={input !== "" ? input :
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

                                            {/* <Box mt={3} mb={2}>
                                                <Typography variant={"h5"}>Novas Instâncias</Typography>
                                            </Box>
                                            <Box ref={samplesRef}>
                                                {
                                                    instances.map((instance: string) => {
                                                        return <Editor height="35vh"
                                                            theme="vs-light"
                                                            defaultLanguage="java"
                                                            defaultValue={instance} />
                                                    })
                                                }
                                            </Box> */}
                                        </Box>
                                    </Box>
                                    <Box sx={{
                                        // backgroundColor: '#081B4B',
                                        backgroundColor: '#f8f8f8',
                                        minHeight: '10vh',
                                        color: 'blue',
                                        padding: '12px 24px',
                                        borderBottomLeftRadius: '12px',
                                        borderBottomRightRadius: '12px',
                                    }}>
                                        <p>Test Run: {testRun}</p>
                                        <p>Failures: {failures}</p>
                                        <p>Errors: {errors}</p>
                                        {/* {output && <ApiContent content={testsOutput} />} */}
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        mt: 1,
                                        mb: 1,
                                        minHeight: "10vh",
                                        borderRadius: "12px",
                                        backgroundColor: "#D3E3FD",
                                        padding: "16px",
                                    }}
                                >
                                    <FormControl fullWidth>
                                        <TextField
                                            label={"Digite uma pergunta"}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton>
                                                            <Search />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </FormControl>
                                    <Typography variant="caption">
                                        Este é um recurso experimental, podendo apresentar pequenas
                                        variações ou falhas
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                    <Drawer anchor={'bottom'} open={openPitest}>
                        <Box p={2} sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",

                            backgroundColor: "navy",
                            color: "white"
                        }}>
                            <Box>
                                <IconButton
                                    onClick={() => {
                                        setOpenPitest(false)
                                    }}>
                                    <Close />
                                </IconButton>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                minHeight: "20vh", marginBottom: "10vh",
                                paddingBottom: "48px"
                            }}>
                            <MutationTableComponent xmlContent={output} />
                        </Box>
                    </Drawer>
                </Grid>
            </Grid>
        </>

    );
}