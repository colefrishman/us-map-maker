import React from 'react';

const StatePath = (props) => {
	const oldVal = parseInt(props.values.get(props.dataId));

	return (
		<path 
			key={props.dataId}
			data-id={props.dataId}
			data-name={props.dataName}
			d={props.d}
			fill={props.colorScheme[Math.min(oldVal, props.colorScheme.length-1)]}
			strokeWidth=".97063"
			onClick={()=>{
				if(oldVal+1 >= props.colorScheme.length){
					props.updateValues(props.dataId,0);
				}
				else{
					props.updateValues(props.dataId, oldVal+1 % props.colorScheme.length);
				}
			}}
			/>
	)
	
}

const LegendLabel = (props) => {
	const x=(85+(parseInt(props.number)%5)*225);
	const y=(615+(props.number>=5)*40);

	return (
		<text x={x} y={y} className="label">{props.text}</text>
	)
	
}

const LegendPath = (props) => {
	if(props.number >= 0){
		const x=(50+(parseInt(props.number)%5)*225);
		const y=(600+(props.number>=5)*40);

		return (
			<path data-id={"L"+props.number} fill={props.colorScheme[props.number]} d={"M "+x+" " +y+" h 30 v 20 h -30 Z"} strokeWidth=".97063" key={"L"+props.number}/>
		)
	}
	else{
		return	<></>
	}
}

const Legend = (props) => {
	let leg = []

	for(let i=props.excludeNoData; i<props.colorScheme.length; ++i){
		leg.push(<LegendLabel key={"label"+i} number={i} className="label" text={props.legend[i]} />)
		leg.push(<LegendPath key={"rect"+i} number={i} colorScheme={props.colorScheme} strokeWidth=".97063"/>)
	}
	return leg;
}

const Svg = (props) => {
	let statesJsx = [];
	props.states.forEach((state)=>{
		statesJsx.push(<StatePath key={state.id} dataId={state.id} dataName={state.name} colorScheme={props.colorScheme} values={props.values} updateValues={props.updateValues} d={state.coords} />)
	})

	return (
	<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink= "http://www.w3.org/1999/xlink"	fill="none" stroke="#000"
	 	strokeLinejoin="round" enable_background="new 0 0 1000 589" pretty_print="False" version="1.1" viewBox="0 -50 1200 800"
		width="100%" style={{backgroundColor:props.backgroundColor}}id={props.id}>
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