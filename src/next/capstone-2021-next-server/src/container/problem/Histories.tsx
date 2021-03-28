import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from "../../modules";
import { Solved } from "../../types";

type Props = {

}

const Histories: React.FunctionComponent<Props> = ({ }) => {
    const { passed } = useSelector((state: RootState) => state.ProbReducer);
    const scrollView: React.MutableRefObject<HTMLDivElement> = React.useRef(null);

    React.useEffect(() => {
        scrollView.current.scrollTop = scrollView.current.scrollHeight;
    }, [ passed ])

    return (
        <div ref={scrollView}
             style={{ width: '200pt', height: '400pt', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflowY: 'auto',
                 background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(218, 215, 229, 1) 20%, rgba(0, 0, 0, 0) 100%)', border: 0, borderRadius: '12pt',
                 paddingLeft: '8pt', paddingRight: '8pt' }}>
            {
                passed && passed.map((pass: Solved) => [
                    <div key={pass.id} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ color: pass.passed ? '#1976d2' : 'indianred', fontWeight: 'bold', fontSize: '10pt' }}>
                            {`${pass.eng}(${pass.tried})`}
                        </p>
                    </div>
                ])
            }
        </div>
    );

}

export default Histories;