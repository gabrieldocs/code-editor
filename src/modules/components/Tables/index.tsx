import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Box,
} from '@mui/material';

const MutationTableComponent = ({ xmlContent }: any) => {
  const [mutations, setMutations] = useState<any[]>([]);

  useEffect(() => {
    console.log(xmlContent)
  }, [])

  useEffect(() => {
    if (xmlContent) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      const mutationNodes = xmlDoc.querySelectorAll('mutation');
      console.log('Number of mutation nodes:', mutationNodes.length); // Log the number of mutation nodes
      setMutations(Array.from(mutationNodes));
    }
  }, [xmlContent]);
  // Calculate the count of killed mutants and total mutants
  const killedMutants = mutations.filter((mutation) => mutation.getAttribute('status') === 'KILLED');
  const totalMutants = mutations.length;

  return (
    <React.Fragment>
      <Box sx={{
        backgroundColor: "navy",
        color: "white"
      }}>
        <Box p={3} mb={3} sx={{
          minHeight: "30vh"
        }}>
          <Typography variant="h3"> {killedMutants.length}/{totalMutants} Mutantes mortos </Typography>
          <Typography>Você está vendo um sumário da execução da última suíte de testes submetida.</Typography>
        </Box>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Source File</TableCell>
            <TableCell>Mutated Class</TableCell>
            <TableCell>Mutated Method</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mutations.map((mutation, index) => (
            <TableRow key={index}>
              <TableCell>{mutation.querySelector('sourceFile').textContent}</TableCell>
              <TableCell>{mutation.querySelector('mutatedClass').textContent}</TableCell>
              <TableCell>
                {mutation.querySelector('mutatedMethod').textContent}
              </TableCell>
              <TableCell>{mutation.getAttribute('status') === 'KILLED' ? <img src="https://www.svgrepo.com/show/65845/dead.svg" alt="killed" width="48px" /> : <img src="https://static.thenounproject.com/png/4520794-200.png" alt="" width="48px" />}</TableCell>
              <TableCell>{mutation.querySelector('description').textContent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

export default MutationTableComponent;
