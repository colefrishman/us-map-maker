import React from 'react';

/**
 * Creates an SVG path element corresponding to a state
 * @param   {String} props.dataId Two letter abbreviation for each state
 * @param   {String} props.dataName Name of the state (e.g. "Florida")
 * @param   {String} props.d SVG path coordinates
 * @param   {Array<String>} props.colorScheme Array of color values
 * @param   {Map<String, Int>} props.values Array of values for each state
 * @param   {function(<String, Int>)} props.updateValues function that updates the value of props.values
 *
 * @returns {JSX} SVG path element for a state
 */
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

/**
 * Labels for the legend
 * @param   {Int} props.number index of the label
 * @param   {String} props.text Text of the label
 *
 * @returns {JSX} SVG text element with loaction determined by number
 */
const LegendLabel = (props) => {
	const x=(985);
	const y=(365+props.number*20);

	return (
		<text x={x} y={y} className="label">{props.text}</text>
	)
	
}

/**
 * Labels for the legend
 * @param   {Number} props.number index of the legend rectangle
 *
 * @returns {JSX} SVG path element with location determined by number
 */
const LegendPath = (props) => {
	if(props.number >= 0){
		const x=(950);
		const y=(350+props.number*20);

		return (
			<path data-id={"L"+props.number} fill={props.colorScheme[props.number]} d={"M "+x+" " +y+" h 30 v 20 h -30 Z"} strokeWidth=".97063" key={"L"+props.number}/>
		)
	}
	else{
		return	<></>
	}
}


/**
 * Creates visible legend in svg
 * @param   {Number} props.excludeNoData create a label for no data if the option is true
 * @param   {Array<String>} props.colorScheme Array of color values
 * @param   {Array<String>} props.legend Legend text
 *
 * @returns {Array<JSX>} SVG path and text elements with loaction based on number of categories
 */
const Legend = (props) => {
	let leg = []

	for(let i=props.excludeNoData; i<props.colorScheme.length; ++i){
		leg.push(<LegendLabel key={"label"+i} number={i} className="label" text={props.legend[i]} />)
		leg.push(<LegendPath key={"rect"+i} number={i} colorScheme={props.colorScheme} strokeWidth=".97063"/>)
	}
	return leg;
}

/**
 * Crates labels for the small states from an array
 * @param   {Array<String>} states State abbreviations
 * @param   {Number} x x location of label
 * @param   {Number} starty y location of highest label
 *
 * @returns {Array<JSX>} SVG path text elements with loaction based on number
 */
const labels = (states, x, starty) => {
	let lab = [];
	let i = 0;
	states.forEach(state => {
		lab.push(<text x={x} y={(starty+i*20)} className="label" key={state}>{state}</text>);
		++i;
	})
	return lab;
}

/**
 * Creates an SVG based on info from props
 * @param   {Map<String, Object>} props.states Important values for each state
 * @param   {Array<String>} props.colorScheme Array of color values
 * @param   {Map<String, Int>} props.values Array of values for each state
 * @param   {function(<String, Int>)} props.updateValues function that updates the value of props.values
 * @param   {String} props.backgroundColor background color of map
 * @param   {String} props.font font of map
 * @param   {String} props.title title of map
 * @param   {Array<String>} props.legend legend text of map
 *
 * @returns {JSX} SVG for the map
 */
const Svg = (props) => {
	let statesJsx = [];
	props.states.forEach((state)=>{
		statesJsx.push(<StatePath key={state.id} dataId={state.id} dataName={state.name} colorScheme={props.colorScheme} values={props.values} updateValues={props.updateValues} d={state.coords} />)
	})

	return (
	<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink= "http://www.w3.org/1999/xlink"	fill="none" stroke="#000"
	 	strokeLinejoin="round" enable_background="new 0 0 1000 589" pretty_print="False" version="1.1" viewBox="50 -100 1200 700"
		width="100%" style={{backgroundColor:props.backgroundColor}} id={props.id}>
		<defs>
		<style type="text/css">{
			"path { fill-rule: evenodd; }"+
			`.label {font: 12px ${props.font}; textAlign:center}`}</style>
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
		<text x="50%" y="-10" adominant-baseline="middle" textAnchor="middle" style={{font: `50px ${props.font}`, textAlign:"center"}}>{props.title}</text>
		<text x="950" y="340" style={{font: `25px ${props.font}`, textAlign:"center"}}>{props.legendTitle}</text>
		<path d="M 930 310 h 300 v 250 h -300 Z" stroke-width=".97063"></path>
		{labels(["NH", "VT", "MA", "RI", "CT", "NJ", "DE", "DC"], 1035, 115)}
		{statesJsx}

		<Legend colorScheme={props.colorScheme} legend={props.legend} excludeNoData={props.excludeNoData}/>
	</svg>
)}

export default Svg;