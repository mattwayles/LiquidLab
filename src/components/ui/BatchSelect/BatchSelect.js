import React from 'react';
import * as ToolTip from '../../../constants/Tooltip';
import './BatchSelect.css';
import Auxil from "../../../hoc/Auxil";

/**
 * Provide a list of batch options to select from
 * @param props A container for the chosen value to be passed
 * @returns {*}
 */
const batchSelect = (props) => (
    <Auxil>
        <div data-tip={ToolTip.BATCH}>
            <select value={props.value} onChange={props.changed}>
                <option value=""> </option>
                <option value="α">α</option>
                <option value="β">β</option>
                <option value="γ">γ</option>
                <option value="δ">δ</option>
                <option value="ε">ε</option>
                <option value="ζ">ζ</option>
                <option value="η">η</option>
                <option value="θ">θ</option>
                <option value="ι">ι</option>
                <option value="κ">κ</option>
                <option value="λ">λ</option>
                <option value="μ">μ</option>
                <option value="ν">ν</option>
                <option value="ξ">ξ</option>
                <option value="ο">ο</option>
                <option value="π">π</option>
                <option value="ρ">ρ</option>
                <option value="σ">σ</option>
                <option value="τ">τ</option>
                <option value="υ">υ</option>
                <option value="φ">φ</option>
                <option value="χ">χ</option>
                <option value="ψ">ψ</option>
                <option value="ω">ω</option>
            </select>
        </div>
    </Auxil>
);


export default batchSelect;