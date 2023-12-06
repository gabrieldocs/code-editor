import { Editor } from "@monaco-editor/react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Close,
  Error,
  ExitToApp,
  FindInPage,
  PlayArrow,
  PrecisionManufacturing,
  Search,
  Sync,
  SyncProblem,
  Terminal,
} from "@mui/icons-material";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
import MutationTableComponent from "../components/Tables";
import { useLogout } from "../../context/auth/useLogout";

const BASE_URL = "https://api.santosworkers.com";
// const BASE_URL = "http://localhost:5500";

export default function Home() {
  const samplesRef = useRef<HTMLDivElement | any>(null);
  const [instances, setInstances] = useState<any[]>([]);

  const [query, setQuery] = useState<string>("");
  const [query_status, setQueryStatus] = useState<boolean>(false);
  const [openConfetti, setOpenConfetti] = useState<boolean>(false);

  const { logout} = useLogout();

  async function createInstance() {
    setQueryStatus(true);
    await axios
      .post(BASE_URL + "/completitions/generate", {
        input: query,
      })
      .then(async (res: AxiosResponse<any>) => {
        setQuery(res.data);
        // toast.info("Construindo código");
        setInstances([...instances, res.data.text.choices[0].message.content]);
      })
      .catch((err) => {
        setOutput("Falha gerar novas dicas");
      })
      .finally(() => {
        setQueryStatus(false);
        const i = setTimeout(() => {
          setOpenConfetti(false);
        }, 5000);

        setOpenConfetti(true);
      });
  }

  const [openPitest, setOpenPitest] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<any>("");
  const [testsOutput, setTestsOutput] = useState<any>("");

  const [testRun, setTestRun] = useState(0);
  const [failures, setFailures] = useState(0);
  const [errors, setErrors] = useState(0);

  const buildCode = async () => {
    await axios
      .post(BASE_URL + "/completitions/build-and-run")
      .then((res: AxiosResponse<any>) => {
        toast.info(res.data);
      })
      .catch((err) => {})
      .finally(() => {
        toast.success("Build request ended");
      });
  };

  const getOutput = async () => {
    await axios
      .get(BASE_URL + "/completitions/retrieve")
      .then((res: AxiosResponse<any>) => {
        // setOutput(res.data.content)
        if (res.data.content) {
          const startIndex = res.data.content.indexOf(" T E S T S");
          const endIndex = res.data.content.indexOf(
            "[INFO] -----------------------------------------------------------------------"
          );

          const sliceString = res.data.content.slice(startIndex, endIndex);
          // setOutput(res.data.content)
          setTestsOutput(sliceString.replace(" T E S T S", "Tests:"));

          // Split the response into lines
          const lines = sliceString.split("\n");
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
        setOutput("Falha ao consultar o terminal");
      })
      .finally(() => {
        toast.info("Terminal query ended");
      });
  };

  const getPitOutput = async () => {
    await axios
      .get(BASE_URL + "/completitions/retrieve-pit")
      .then((res: AxiosResponse<any>) => {
        setOutput(res.data);
        setOpenPitest(true);
      })
      .catch((err) => {
        console.log(err);
        setOutput("Falha ao consultar o terminal");
      })
      .finally(() => {
        toast.info("Abrindo sumário de testes");
      });
  };

  const getContents = async (path?: string) => {
    await axios
      .get(BASE_URL + "/completitions/contents", {
        params: {
          filePath:
            path ??
            "./public/unzipped/1693959366583_sample/sample/src/test/java/com/example/CalculatorTest.java",
        },
      })
      .then((res: AxiosResponse<any>) => {
        setInput(res.data);
      })
      .catch((err) => {
        setOutput("Falha ao consultar o arquivo");
      });
  };

  const submitTestSuit = async () => {
    await axios
      .post(BASE_URL + "/completitions/write-to-file", {
        textContent: input,
      })
      .then(async (res: AxiosResponse<any>) => {
        // setInput(res.data);
        await buildCode();
        toast.info("Construindo código");
      })
      .catch((err) => {
        setOutput("Falha ao escrever no arquivo");
      });
  };

  useEffect(() => {
    getContents();
  }, []);
  return (
    <>
      {/* <Confetti width={window.innerWidth} height={window.innerHeight} /> */}
      {openPitest || openConfetti ? (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      ) : (
        <></>
      )}
      <Backdrop open={query_status} sx={{ zIndex: 100000 }}>
        <CircularProgress color="primary" />
      </Backdrop>
      {/* <Appbar /> */}
      <Grid container>
        <Grid
          item
          md={3}
          sx={{
            // display: "none",
            height: "100vh",
            backgroundColor: "#f0f9ff",
          }}
        >
          <Box p={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <IconButton size="small">
                <ChevronLeft />{" "}
              </IconButton>
              <Typography variant="h5">
                <strong>PleTEST</strong>
              </Typography>

              <IconButton onClick={logout}>
                <ExitToApp />
              </IconButton>
            </Box>
            <Box mb={3} mt={3}>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: "18px",
                }}
              >
                Bem vindo(a) ao mundo dos testes de software! Neste desafio
                vamos praticar a escrita de casos de teste simples.
              </Typography>

              <Box
                m={1}
                sx={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  avatar={
                    <Avatar>
                      <FindInPage />
                    </Avatar>
                  }
                  label="CalculatorTest.java"
                  onClick={async () => {
                    await getContents(
                      "./public/unzipped/1693959366583_sample/sample/src/test/java/com/example/CalculatorTest.java"
                    );
                  }}
                />
                <Chip
                  avatar={
                    <Avatar>
                      <FindInPage />
                    </Avatar>
                  }
                  label="Calculator.java"
                  onClick={async () => {
                    await getContents(
                      "./public/unzipped/1693959366583_sample/sample/src/main/java/com/example/Calculator.java"
                    );
                  }}
                />
                <Chip
                  avatar={
                    <Avatar>
                      <FindInPage />
                    </Avatar>
                  }
                  label="Calculator2.java"
                  onClick={async () => {
                    await getContents(
                      "./public/unzipped/1693959366583_sample/sample/src/main/java/com/example/Calculator2.java"
                    );
                  }}
                />
                <Chip
                  avatar={
                    <Avatar>
                      <FindInPage />
                    </Avatar>
                  }
                  label="Calculator2Test.java"
                  onClick={async () => {
                    await getContents(
                      "./public/unzipped/1693959366583_sample/sample/src/test/java/com/example/Calculator2Test.java"
                    );
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: "18px",
                }}
              >
                {/* The code stubs in your editor declare a Solution class and a
                main method. Complete the main method by copying the two lines
                of code below and pasting them inside the body of your main
                method.  */}
                O código no editor declara um classe de teste referente à uma
                classe de nome semelhante. Complete a classe adicionando novos
                métodos utilizando o editor e ao final utilize o botão
                "Sincronizar" para submeter sua solução.
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          md={9}
          sx={{
            height: "100vh",
            overflow: "scroll",
          }}
        >
          <Container>
            <Box mt={3} mb={3} sx={{ display: "none" }}>
              <Typography variant="h1">Sentinel</Typography>
              <Typography variant="h1">Test Agains Mutants</Typography>
              <Typography variant="h5">
                Tryout a sample and learn by example
              </Typography>
            </Box>

            <Grid container sx={{ mt: 3 }}>
              <Grid item md={12} sx={{ overflow: "scroll" }}>
                <Box
                  sx={{
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      //   bgcolor: amber["A400"],
                      //   bgcolor: "navy",
                      //   color: "white",
                      bgcolor: "blue",
                      color: "white",
                      padding: "12px 24px",
                      borderTopRightRadius: "12px",
                      borderTopLeftRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <IconButton sx={{ color: "white" }}>
                      <ChevronLeft />
                    </IconButton>
                    <Box
                      sx={{
                        padding: "6px 24px",
                        borderRadius: "12px",
                        // border: "solid thin" + amber[500],
                      }}
                    >
                      <Typography variant="body1">
                        CalculatorTest.java
                      </Typography>
                    </Box>

                    <IconButton sx={{ color: "white" }}>
                      <ChevronRight />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      padding: "12px 24px",
                      border: "solid thin #ddd",
                    }}
                  >
                    {/* <Box mb={3} mt={3}>
                      <Typography variant="body1">
                        Edite o código abaixo para inserir novos casos de teste
                        ou editar os testes existentes.
                      </Typography>
                    </Box> */}

                    <Box>
                      <Box mb={2} display="flex" gap={1}>
                        <Button
                          variant="outlined"
                          startIcon={<PrecisionManufacturing />}
                          onClick={createInstance}
                        >
                          Generate
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Sync />}
                          onClick={submitTestSuit}
                        >
                          1 - Sincronizar
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<PlayArrow />}
                          onClick={buildCode}
                        >
                          2- Executar
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Terminal />}
                          onClick={getOutput}
                        >
                          3 - Terminal do JUnit
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Terminal />}
                          onClick={getPitOutput}
                        >
                          4 - Terminal do Pitest
                        </Button>
                      </Box>
                      <Editor
                        height="45vh"
                        theme="vs-light"
                        defaultLanguage="java"
                        value={
                          input !== ""
                            ? input
                            : `
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
                          console.log(e);
                          if (e) setInput(e);
                        }}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      // backgroundColor: '#081B4B',
                      border: "solid thin #ddd",
                      borderTop: "none",
                      //   backgroundColor: "#f8f8f8",
                      minHeight: "6vh",
                      color: "blue",
                      padding: "12px 24px",
                      borderBottomLeftRadius: "12px",
                      borderBottomRightRadius: "12px",
                      display: "flex",
                      gap: "12px",
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <Check /> Test Run: {testRun}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <Error />
                      Failures: {failures}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <SyncProblem /> Errors: {errors}
                    </Typography>
                    {/* {output && <ApiContent content={testsOutput} />} */}
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    borderRadius: "12px",
                    border: "solid thin #ddd",
                    overflow: "hidden",
                  }}
                >
                  <Box mt={3} mb={2} p={3}>
                    <Typography variant={"h5"}>Assistente por IA</Typography>
                    <Typography variant={"body1"}>
                      Exemplos gerados a partir do input fornecido:
                    </Typography>
                  </Box>
                  <Box ref={samplesRef}>
                    {instances.map((instance: string, index: number) => {
                      return (
                        <Box mt={3} mb={3}>
                          <Box p={2}>
                            <Typography>
                              Aqui está um exemplo de como testar o fragmento de
                              código selecionado - {index}
                            </Typography>
                          </Box>
                          <Editor
                            height="35vh"
                            theme="vs-light"
                            defaultLanguage="java"
                            defaultValue={instance}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
                <Box
                  sx={{
                    mt: 1,
                    mb: 1,
                    backgroundColor: "white",
                    minHeight: "10vh",
                    borderRadius: "12px",
                    // backgroundColor: "#D3E3FD",
                    padding: "16px",
                    textAlign: "center",
                  }}
                >
                  <FormControl fullWidth>
                    <TextField
                      label={"Digite uma pergunta"}
                      onChange={(e) => {
                        setQuery(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={createInstance}>
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
          <Dialog open={openPitest} maxWidth="lg">
            <Box
              p={2}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                backgroundColor: "navy",
                color: "white",
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Terminal></Terminal>
                Sumário dos testes
              </Typography>
              <Box>
                <IconButton
                  sx={{
                    color: "white",
                  }}
                  onClick={() => {
                    setOpenPitest(false);
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            </Box>
            <Box
              sx={{
                minHeight: "20vh",
                marginBottom: "10vh",
                paddingBottom: "48px",
              }}
            >
              <MutationTableComponent xmlContent={output} />
            </Box>
          </Dialog>
        </Grid>
      </Grid>
    </>
  );
}
