import React from 'react';
import { NextRouter, useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { useSelector } from 'react-redux';
import { GET_BAR, GET_PIE, GET_RADAR, GET_REPORT } from "../../src/graphQL/quries";
import { ArrowBackRounded, CheckRounded, CompareArrowsRounded } from "@material-ui/icons";
import { ReportDetails } from "../../src/components";
import { Bar, Pie, Radar, PieRadioBtns } from "../../src/components/charts";
import { RootState } from "../../src/modules";
import Cookies from 'js-cookie';

const Report = ({ ri }) => {
    const router: NextRouter = useRouter();
    const { id } = useSelector((state: RootState) => state.ReportReducer);

    const getReportKey = () => {
        let reportKey: number | undefined = id;
        let rk: string | string[] | undefined = router.query?.ct;
        if (!id && typeof rk === 'string')
            reportKey = parseInt(rk)
        return reportKey;
    }

    const [ radio, setRadio ] = React.useState<number>(0);
    const onClickRadioBtn = (clicked: number) => {
        if (radio !== clicked && clicked >= 0 && clicked <= 2) {
            setRadio(clicked);
        }
    }
    const ref: React.MutableRefObject<HTMLDivElement> = React.useRef(null);
    // mimicry micro service
    const pie = useQuery(GET_PIE, { variables: { report: ri ? ri : getReportKey(), option: radio }, fetchPolicy: "cache-and-network" })
    const bar = useQuery(GET_BAR, { variables: { report: ri ? ri : getReportKey() }, fetchPolicy: "cache-first" })
    const radar = useQuery(GET_RADAR, { variables: { report: ri ? ri : getReportKey() }, fetchPolicy: "cache-first" })
    const details = useQuery(GET_REPORT, { variables: { report: ri ? ri : getReportKey() }, fetchPolicy: "cache-first" })
    return (
        <div>
            <ArrowBackRounded fontSize={'large'} style={{ position: 'absolute', left: '12pt', top: '32pt',
                color: Cookies.get('dove-dark-mode') === 'true' ? '#FFF' : '#000', cursor: 'pointer' }}
                              onClick={() => router.back()} />
            <div style={{ width: '100%', height: '100%', padding: '50pt' }}>
                <div ref={ref} style={{ width: 'calc(100% - 40pt)', height: '100%', backgroundColor: '#FFF', borderRadius: '12pt',
                    boxShadow: '0px 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s', padding: '24pt' }}>
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <CheckRounded fontSize={'large'} style={{ color: '#000'}} />
                                <span style={{ color: '#000', fontFamily: 'sans-serif', fontSize: '19pt', fontWeight: 'bold', marginLeft: '8pt' }}>
                                    {`정답률 (${radio === 0 ? '전체' : radio === 1 ? '단어' : '문장'})`}
                                </span>
                            </div>
                            <PieRadioBtns selectedValue={radio} onClickBtn={onClickRadioBtn} />
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Pie data={pie.data ? pie.data.pie.data : [ ]} />
                                <Radar data={radar.data ? radar.data.radar.data : [ ]} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CompareArrowsRounded fontSize={'large'} style={{ color: '#000'}} />
                            <span style={{ color: '#000', fontFamily: 'sans-serif', fontSize: '19pt', fontWeight: 'bold', marginLeft: '8pt' }}>
                                정답률 비교
                            </span>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Bar data={bar.data ? bar.data.bar.data : [ ]} />
                            <ReportDetails details={details.data ? details.data.report : { }} selectedValue={0} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

Report.getInitialProps = async ({ query }) => {
    let { ri } = query
    if (typeof ri === 'string')
        ri = parseInt(ri);
    return { ri };
}

export default Report;