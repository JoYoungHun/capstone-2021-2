import React from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from "@apollo/client";
import { NextRouter, useRouter } from "next/router";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@material-ui/core";
import { GET_RECENT_REPORT } from "../graphQL/quries";
import { Paginate, ReportHeaderProps } from "../types";
import { storeReport } from "../reducers/ReportReducer";
import Cookies from 'js-cookie';
import Notiflix from 'notiflix';

type Props = {

}

const RecentReport: React.FunctionComponent<Props> = ({ }) => {
    const dispatch = useDispatch();
    const router: NextRouter = useRouter();
    const [ pageProps, setPageProps ] = React.useState<Paginate>({
        page: 1,
        renderItem: 10,
    });
    let { page, renderItem } = pageProps;

    const onRouteToReport = async (id: number) => {
        await new Promise((resolve) => {
            Notiflix.Loading.Dots('Routing...');
            dispatch(storeReport(id));
            setTimeout(() => {
                resolve(true);
            }, 1500)
        }).then(() => router.push(`/report?ri=${id}`).then(() => Notiflix.Loading.Remove(500)));
    }

    const { data, loading, error } = useQuery(GET_RECENT_REPORT, { variables: { pr: { page, renderItem } }})
    return (
        <div style={{ border: 0, boxShadow: '0px 3px 6px #0000029', width: '100%', height: '300pt', overflow: 'scroll', marginTop: '8pt' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14pt', fontFamily: 'sans-serif' }}>
                나의 최근 리포트
            </span>
            <div style={{ marginTop: '8pt', width: '100%' }}>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>컨텐츠</TableCell>
                                <TableCell align="right">변경(생성)일</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data && data.recent && data.recent.reports.map(
                                    (report: ReportHeaderProps) => (
                                        <TableRow key={report.id} style={{ cursor: 'pointer' }} onClick={() => onRouteToReport(report.id)}>
                                            <TableCell component="th" scope="row">
                                                {report.content.title}
                                            </TableCell>
                                            <TableCell align="right">{report.modified}</TableCell>
                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <TablePagination
                        style={{ width: '100%', color: Cookies.get('dove-dark-mode') === 'true' ? '#FFF' : '#000' }}
                        component={"div"}
                        count={data && data.recent ? data.recent.totalElements : 0}
                        page={pageProps.page - 1}
                        onChangePage={(_, e) => {
                            setPageProps({ ...pageProps, page: e + 1 })}}
                        rowsPerPage={pageProps.renderItem}
                        onChangeRowsPerPage={(e) => {
                            setPageProps({ ...pageProps, renderItem: parseInt(e.target.value) })}}
                    />
                </div>
            </div>
        </div>
    )
}

export default RecentReport;