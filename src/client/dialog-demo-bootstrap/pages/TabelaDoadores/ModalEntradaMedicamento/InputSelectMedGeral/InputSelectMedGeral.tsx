import React from 'react';
import Select from 'react-select';


export default function InputSelectMedGeral({ label, lista, data, setData }: { label: string, lista: any, data: string, setData: Function}) {

    const handelSelect = (e: any) => {
        setData(e);
    }

    return (
        <>
            <h6 style={{marginBottom: '18px'}}>{label}</h6>
            <Select
                className="basic-single ReactSelect"
                classNamePrefix="select"
                isDisabled={false}
                isLoading={false}
                isClearable={true}
                isRtl={false}
                isSearchable={true}
                name="color"

                options={lista}
                onChange={handelSelect}
                value={data}
            />
        </>
    );
}