import React from 'react';
import {CloseOutlined, InsertEmoticonRounded, MoodBadRounded, SentimentDissatisfiedRounded} from "@material-ui/icons";
import {Button, Modal} from "@material-ui/core";

type Props = {
    hidden: boolean,
    close: () => void
}

const LevelGuideModal: React.FunctionComponent<Props> = ({ hidden, close }) => {
    return (
        <Modal open={!hidden} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{ width: '400pt', background: '#FFF 0% 0% no-repeat padding-box', height: '400pt', padding: '8pt' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#000', fontSize: '11pt', fontWeight: 'bold' }}>
                        난이도가 뭘 적용시키나요?
                    </p>
                    <CloseOutlined style={{ cursor: 'pointer', color: '#d64161' }} fontSize={"large"} color={"primary"} onClick={() => close()} />
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', paddingLeft: '8pt', paddingRight: '8pt', color: '#000' }}>
                    <div style={{ height: '100pt', fontSize: '11pt' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '40pt', backgroundColor: '#1976d2', paddingLeft: '4pt' }}>
                            <InsertEmoticonRounded style={{ marginRight: '6pt' }} fontSize="small" />
                            <span style={{ fontWeight: 'bold' }}>Level 1!</span>
                        </div>
                        <br />
                        <span>
                            별 다른 적용 사항이 없습니다.
                        </span>
                    </div>
                    <div style={{ height: '100pt', fontSize: '13pt' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '40pt', backgroundColor: 'mediumaquamarine', paddingLeft: '4pt' }}>
                            <SentimentDissatisfiedRounded style={{ marginRight: '6pt' }} fontSize="small" />
                            <span style={{ fontWeight: 'bold' }}>Level 2!</span>
                        </div>
                        <br />
                        <span>
                            오른쪽 요약에 보이는 영문장들이 30% 가려져 보여집니다!
                        </span>
                    </div>
                    <div style={{ height: '100pt', fontSize: '15pt' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '40pt', backgroundColor: 'lightcoral', paddingLeft: '4pt' }}>
                            <MoodBadRounded style={{ marginRight: '6pt' }} fontSize="small" />
                            <span style={{ fontWeight: 'bold' }}>Level 3!</span>
                        </div>
                        <br />
                        <span>
                            오른쪽 요약에 보이는 영문장들이 70% 가려져 보여집니다!
                        </span>
                    </div>
                    <div style={{ width: '100%', height: '50pt' }}>
                        <Button style={{ width: '100%', height: '100%', backgroundColor: '#FFE94A' }} onClick={() => close()}>
                            <span>
                                확인했습니다.
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default LevelGuideModal;