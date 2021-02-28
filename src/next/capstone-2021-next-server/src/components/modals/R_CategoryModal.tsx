import React from 'react';
import { useQuery } from "@apollo/client";
import {createStyles, FormControl, InputLabel, makeStyles, MenuItem, Modal, Select, Theme} from "@material-ui/core";
import { GET_CATEGORIES } from "../../graphQL/quries";
import { Category } from "../../types";
import { Error, Loading } from "../index";

type Props = {
    hidden: boolean
    setCategories: ( selected: Category[] ) => void
    close: () => void
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            width: '100%',
            height: '50pt'
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);

const R_CategoryModal: React.FunctionComponent<Props> = ({ hidden, close, setCategories }) => {
    const classes = useStyles();
    const [ selectedCategories, setSelectedCategories ] = React.useState<Category[]>([]);

    const putIfAbsent = (ctg: Category) => {
        let temporary: Category[] = selectedCategories;
        let located: number = -1;
        for (let i = 0; i < temporary.length; i++) {
            if (ctg.id === temporary[i].id)
                located = i;
        }

        if (located === -1) {
            temporary.push(ctg);
        } else {
            temporary = [ ...temporary.slice(0, located), ...temporary.slice(located + 1, temporary.length) ]
        }
        setSelectedCategories([ ...temporary ]);
    }
    let categoryNames: string[] = selectedCategories.map((ctg: Category) => ctg.name);

    const { data, loading, error } = useQuery(GET_CATEGORIES);

    if (loading) return <Loading />
    else if (error) return <Error msg={error.message} />
    return (
        <Modal open={!hidden} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{ width: '400pt', height: '300pt' }}>
                <div style={{ width: '100%', height: '240pt', backgroundColor: '#FFF', paddingLeft: '4pt', paddingRight: '4pt', paddingTop: '8pt'
                    , fontFamily: 'sans-serif' }}>
                    <div style={{ width: '100%', display: 'center', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <span style={{ color: '#000', fontSize: '15pt' }}>
                            카테고리를 선택해주세요.
                        </span>
                        <br />
                        <span style={{ color: '#000', fontSize: '8pt' }}>
                            {`선택된 카테고리: ${categoryNames.toString()}`}
                        </span>
                    </div>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={undefined}
                            onChange={() => { }}
                        >
                            {
                                data && data.categories && data.categories.map((ctg: Category) => (
                                    <MenuItem value={ctg.id} key={ctg.id} onClick={() => putIfAbsent(ctg)}>
                                        {ctg.name}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </div>
                <div style={{ width: '100%', height: '60pt', display: 'flex', fontFamily: 'sans-serif' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
                        width: '50%', height: '100%', background: 'gray 0% 0% no-repeat padding-box' }}
                         onClick={() => close()}>
                        <span style={{ color: '#FFF', fontWeight: 'bold', fontSize: '14pt'}}>
                            취소
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
                        width: '50%', height: '100%', background: '#FFE94A 0% 0% no-repeat padding-box' }}
                         onClick={() => setCategories(selectedCategories)}>
                        <span style={{ color: '#000', fontWeight: 'bold', fontSize: '14pt'}}>
                            확인
                        </span>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default R_CategoryModal;