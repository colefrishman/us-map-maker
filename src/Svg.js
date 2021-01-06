import React, {useState} from 'react';
import states from './data.js'

const StatePath = (props) => {
	const [value, setValue] = useState(0);

	return (
		<path 
			data-id={props.dataId}
			data-name={props.dataName}
			d={props.d}
			fill={props.colorScheme[Math.min(value, props.colorScheme.length-1)]}
			strokeWidth=".97063"
			onClick={()=>{(value+1 >= props.colorScheme.length) ? setValue(0) : setValue((value+1) % props.colorScheme.length);}}/>
	)
	
}

const LegendLabel = (props) => {
	const x=235+parseInt(props.number)*100;
	const y=615;

	return (
		<text x={x} y={y} className="label">{props.text}</text>
	)
	
}

const LegendPath = (props) => {
	if(props.number >= 0){
		const x=(200+parseInt(props.number)*100);
		const y=600;

		return (
			<path data-id={"L"+props.number} fill={props.colorScheme[props.number]} d={"M "+x+" " +y+" h 30 v 20 h -30 Z"} strokeWidth=".97063"/>
		)
	}
	else{
		return	<></>
	}
}

const Legend = (props) => {
	let leg = []

	for(let i=props.excludeNoData; i<props.colorScheme.length; ++i){
		leg.push(<LegendLabel key={"label"+i} number={i} y="615" className="label" text={props.legend[i]} />)
		leg.push(<LegendPath key={"rect"+i} number={i} colorScheme={props.colorScheme} strokeWidth=".97063"/>)
	}
	return [leg];
}

const Svg = (props) => {
	let statesJsx = [];
	states.forEach((state)=>{
		statesJsx.push(<StatePath key={state.id} dataId={state.id} dataName={state.name} colorScheme={props.colorScheme} d={state.coords} />)
	})

	return (
	<svg fill="none" stroke="#000" strokeLinejoin="round" enable_background="new 0 0 1000 589" pretty_print="False" version="1.1" viewBox="0 -50 1200 800" width="50%">
		<defs>
		<style type="text/css">{
			"path { fill-rule: evenodd; }"+
			".label {font: 12px serif, textAlign:center}"}</style>
		</defs>
		<metadata>
			<views>
				{/*  */}
				<view h="589.235294118" padding="0" w="1000">
					<proj lat0="45" lon0="-100"/>
					<bbox x="690.09" y="918.69" h="321.97" w="589.33"/>
				</view>
			</views>
		</metadata>
		<text x="50%" y="-10" adominant-baseline="middle" textAnchor="middle" style={{font: "50px sans-serif", textAlign:"center"}}>{props.title}</text>
		<text x="1035" y="215" className="label">NH</text>
		<text x="1035" y="235" className="label">VT</text>
		<text x="1035" y="255" className="label">MA</text>
		<text x="1035" y="275" className="label">RI</text>
		<text x="1035" y="295" className="label">CT</text>
		<text x="1035" y="315" className="label">NJ</text>
		<text x="1035" y="335" className="label">DE</text>
		<text x="1035" y="355" className="label">DC</text>
		{statesJsx}

		<Legend colorScheme={props.colorScheme} legend={props.legend} excludeNoData={props.excludeNoData}/>
	</svg>
)}

export default Svg