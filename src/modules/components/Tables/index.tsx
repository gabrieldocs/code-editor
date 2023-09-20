import React from 'react';
import {Check, Error, FaceRetouchingOff, SentimentVeryDissatisfied} from "@mui/icons-material";

const MutationTable = ({ mutations }: any) => {
    return (
        <div
            style={{
                padding: "12px 24px",
        }}>
            <table>
                <thead>
                <tr>
                    <th>Detected</th>
                    <th>Status</th>
                    <th>Number of Tests Run</th>
                    <th>Source File</th>
                    <th>Mutated Class</th>
                    <th>Mutated Method</th>
                    <th>Method Description</th>
                    <th>Line Number</th>
                    <th>Mutator</th>
                    {/*<th>Indexes</th>*/}
                    {/*<th>Blocks</th>*/}
                    <th>Killing Test</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>
                {mutations.map((mutation: any, index: number) => (
                    <tr key={index}>
                        <td style={{ minWidth: "96px", textAlign: "center"}}>{JSON.parse(mutation.$.detected) ? <Check /> : <Error />}</td>
                        <td style={{ minWidth: "96px", textAlign: "center"}}>{mutation.$.status === "KILLED" ? <FaceRetouchingOff /> : <SentimentVeryDissatisfied />}</td>
                        <td style={{ minWidth: "256px", textAlign: "center"}}>{mutation.$.numberOfTestsRun}</td>
                        <td style={{ minWidth: "256px", textAlign: "center"}}>{mutation.sourceFile[0]}</td>
                        <td style={{ minWidth: "256px", textAlign: "center"}}>{mutation.mutatedClass[0]}</td>
                        <td style={{ minWidth: "256px", textAlign: "center"}}>{mutation.mutatedMethod[0]}</td>
                        <td style={{ minWidth: "256px", textAlign: "center"}}>{mutation.methodDescription[0]}</td>
                        <td style={{ minWidth: "256px", textAlign: "center"}}>{mutation.lineNumber[0]}</td>
                        <td style={{ minWidth: "456px", padding: "0 12px", textAlign: "left"}}>{mutation.mutator[0]}</td>
                        {/*<td>{mutation.indexes[0].index[0]}</td>*/}
                        {/*<td>{mutation.blocks[0].block[0]}</td>*/}
                        <td style={{ minWidth: "456px", padding: "0 12px", textAlign: "left"}}>{mutation.killingTest[0]}</td>
                        <td style={{ minWidth: "456px", padding: "0 12px", textAlign: "left"}}>{mutation.description[0]}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MutationTable;
