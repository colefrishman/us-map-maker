import './App.css';
import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import colorbrewer from 'colorbrewer'
import Svg from './Svg'
import states from './data.js'
import fileDownload from 'js-file-download'
import {saveSvgAsPng} from 'save-svg-as-png';

/**
 * Creates a Map with initial values for the imported states
 * @return {Map<String, Number>}      Map with state.id as keys and 0 as value
 */
const fillMap = () => {
	let temp = new Map()
	states.forEach((state)=>{
		temp.set(state.id, 0);
	})
	return temp
}

/**
 * Holds the logic of the app
 * @return {JSX}      JSX component corresponding to the app
 */
function App() {
	const [title, setTitle] = useState("Title");
	const [color, setColor] = useState("Reds");
	const [categories, setCategories] = useState(3);
	const [colorScheme, setColorScheme] = useState(["#aaaaaa", "#fee0d2", "#fc9272", "#de2d26"]); 
	const [excludeNoData, setExcludeNoData] = useState(0);
	const [legend, setLegend] = useState(["No data", "Cat. 1", "Cat. 2", "Cat. 3", "Cat. 4", "Cat. 5", "Cat. 6", "Cat. 7", "Cat. 8", "Cat. 9"]); 
	const [values, setValues] = useState(fillMap());
	const [csvPath, setCsvPath] = useState("");
	const [backgroundColor, setBackgroundColor] = useState("white");
	const [fontFamily, setFontFamily] = useState("serif");
	const [legendTitle, setLegendTitle] = useState("Legend");

	/**
 	* Updates the color scheme based on the given color and category values
 	* @param  {String} colr color as a word or hex value
 	* @param  {Number} cat number of categories in the color scheme
 	*/
	const updateScheme = (colr, cats) => {
		setColor(colr);
		setCategories(cats);
		let tempScheme = colorbrewer[colr][cats];
		if(tempScheme[0] !== "#aaaaaa" && !(["Greys","RdGy"].includes(colr))){
			tempScheme.unshift("#aaaaaa");
		}
		else if(tempScheme[0] !== "#ffffff" && (["Greys"].includes(colr))){
			tempScheme.unshift("#ffffff");
		}
		else if(tempScheme[0] !== "#000000" && (["RdGy"].includes(colr))){
			tempScheme.unshift("#000000");
		}

		setColorScheme(tempScheme);
	}

	/**
 	* Updates the Legend
 	* @param  {number} index Index of the category label
 	* @param  {Number} text New text of the category label
 	*/
	const updateLegend = (index, text) => {
		let temp = [...legend];
		temp[index]=text;
		setLegend(temp)
	}

	/**
	 * Updates the value for a state
	 * @param  {String} key id of state to be updated
	 * @param  {Number} value new value of the updated state
	 */
	const updateValues = (key, value) => {
		setValues((prev) => new Map(prev).set(key, value));
	}

	/**
	 * Downloads the map as an svg straight from the page 
	 */
	const downloadSvg = () => {
		fileDownload(document.getElementById("map").outerHTML, `${title}-us-map-maker.svg`);
	}

	/**
	 * Creates the inputs for legend labels
	 * @return {Array<JSX>}      Legend label inputs
	 */
	const LegendInput = () => {
		let temp = []
		for (let i=excludeNoData; i<=categories; ++i){
			temp.push(<Form.Control key={i} style={{width:"300px", marginLeft:"10px", marginBottom:"5px"}}
			 type="text" value={legend[i]} maxLength="19" onChange={(event)=>{updateLegend(i, event.target.value)}} />)
		}
		return temp;
	}

	/**
	 * Updates the state of the map to match values from an uploaded csv
	 * @param  {String} num1 file path
	 */
	const fillValuesFromCsv = (file) => {
		if(file===""){alert("Upload a file in the correct format"); return;}
		try {
			let reader = new FileReader();
			reader.readAsText(file);
			reader.onload = (e) => {	
				let str = (reader.result).toString();

				let col = color;
				let cats = categories;
				let titl = title;
				let exNoData = excludeNoData;
				let legTitl = legendTitle;
				let backCol = backgroundColor;
				let fontFam = fontFamily;

				str.split("\n").forEach(line => {
					const splitLine = line.split(",")
					const key = splitLine[0]
					const val = splitLine[1]
					switch (key){
						case "categories": cats = parseInt(val); break;
						case "color": col = val.trim(); break;
						case "title": titl = val; break;
						case "excludeNoData": exNoData = parseInt(val); break;
						case "fontFamily": fontFam = val; break;
						case "backgroundColor": backCol = val; break;
						case "legendTitle": legTitl = val; break;
						default: updateValues(key, val);
					}
				})
				updateScheme(col, cats)
				setTitle(titl);
				setExcludeNoData(exNoData)
				setFontFamily(fontFam)
				setLegendTitle(legTitl);
				setBackgroundColor(backCol);
			}
			alert("File Uploaded!");
		}
		catch(exception){
			alert("Upload a file in the correct format");
		}
		finally{

		}
	}

	/**
	 * Generates text of a csv file usable by this application to prepare for download
	 * @return {String} The content of the csv
	 */
	const generateCsv = () => {
		let out = "";
		out+= `title,${title}\n`
		out+= `color,${color}\n`
		out+= `categories,${categories}\n`
		out+= `excludeNoData,${excludeNoData}\n`
		out+= `legendTitle,${legendTitle}\n`
		out+= `fontFamily,${fontFamily}\n`
		out+= `backgroundColor,${backgroundColor}\n`

		values.forEach((val, stateId)=>{
			out+= `${stateId},${val}\n`
		})

		return out;
	}

	/**
	 * Generates a csv and starts a download. See generateCsv().
	 */
	const exportToCsv = () => {
		fileDownload(generateCsv(), `${title}-us-map-maker.csv`);
	}

	/**
	 * Donloads the map as a png.
	 */
	const downloadAsPng = () => {
		saveSvgAsPng(document.getElementById("map"), `${title}-us-map-maker.png`, {top: -100, left:50});
	}
	

	return(
		<div>
			<div id="mapsplit">
				<h1>U.S. Map Maker</h1>
				<Form.File id="dataImport" label="Import data" accept="text/csv" onChange={(event) => {setCsvPath(event.target.files[0])}}/>
				<Button onClick={() => {fillValuesFromCsv(csvPath)}}>Import from CSV</Button>
				<Button onClick={() => {exportToCsv()}}>Export to CSV</Button>
				<br />
				<Button onClick={() => {downloadSvg()}}>Download as SVG</Button>
				<Button onClick={() => {downloadAsPng()}}>Download as PNG</Button>
				<br />
				<Svg colorScheme={colorScheme} title={title} legend={legend} excludeNoData={excludeNoData} backgroundColor={backgroundColor} values={values} updateValues={updateValues}
					states={states} font={fontFamily} legendTitle={legendTitle} id="map"/>
			</div>
			<div id="optionssplit">
				
				<Form.Check type="checkbox" label="Exclude 'No data'" onChange={() => {setExcludeNoData((1-excludeNoData)%2)}} checked={excludeNoData} />
	
				<Form.Label>Colors</Form.Label>
				<Form.Control as="select" style={{width:"300px", marginLeft:"10px", marginBottom:"5px"}} onChange={(event)=>{updateScheme(event.target.value, categories)}} value={color}>
					<option disabled> </option>
					<option disabled>Sequential (Single Hue):</option>
    				<option value="Greens">Green</option>
    				<option value="Reds">Red</option>
    				<option value="Blues">Blue</option>
    				<option value="Greys">Gray</option>
    				<option value="Oranges">Orange</option>
    				<option value="Purples">Purple</option>

					<option disabled> </option>
					<option disabled>Sequential (Multi Hue):</option>
    				<option value="BuGn">Blue green</option>
    				<option value="BuPu">Blue purple</option>
    				<option value="GnBu">Green blue</option>
    				<option value="OrRd">Orange red</option>
    				<option value="PuBu">Purple blue</option>
    				<option value="PuBuGn">Purple blue green</option>
					
    				<option value="PuRd">Purple red</option>
    				<option value="RdPu">Red purple</option>
    				<option value="YlGn">Yellow green</option>
    				<option value="YlGnBu">Yellow green blue</option>
    				<option value="YlOrBr">Yellow orange brown</option>
    				<option value="YlOrRd">Yellow orange red</option>

					<option disabled> </option>
					<option disabled>Diverging:</option>
    				<option value="RdBu">Red-Blue</option>
    				<option value="BrBG">Brown-Bluegreen</option>
    				<option value="PiYG">Pink-Yellowgreen</option>
    				<option value="PRGn">Purple-Green</option>
    				<option value="PuOr">Purple-Orange</option>
    				<option value="RdGy">Red-Gray</option>
    				<option value="RdYlBu">Red-Yellow-Blue</option>
    				<option value="RdYlGn">Red-Yellow-Green</option>
    				<option value="Spectral">Spectral</option>

					<option disabled> </option>
					<option disabled>Qualitative:</option>
    				<option value="Set1">Set 1</option>
    				<option value="Pastel1">Pastel 1</option>
    				<option value="Set3">Set 3</option>
    				<option value="Paired">Paired</option>
    			</Form.Control>

				<Form.Label>Categories</Form.Label>
				<Form.Control as="select" style={{width:"300px", marginLeft:"10px", marginBottom:"5px"}} onChange={(event)=>{updateScheme(color, parseInt(event.target.value))}} value={categories}>
    				<option>3</option>
    				<option>4</option>
    				<option>5</option>
    				<option>6</option>
    				<option>7</option>
    				<option>8</option>
    				<option>9</option>
    			</Form.Control>
	
				<Form.Label>Title</Form.Label>
				<Form.Control type="text" style={{width:"300px", marginLeft:"10px", marginBottom:"5px"}} onChange={(event)=>{setTitle(event.target.value)}} value={title}/>
	
				<Form.Label>Background Color</Form.Label>
				<span style={{backgroundColor:backgroundColor, width:"30px", height:"30px"}}/>
				<Form.Control type="text" style={{width:"300px", marginLeft:"10px", marginBottom:"5px"}} onChange={(event)=>{setBackgroundColor(event.target.value)}} value={backgroundColor}/>
	
				<Form.Label>Font Family</Form.Label>
				<Form.Control as="select" style={{width:"300px", marginLeft:"10px", marginBottom:"5px"}} onChange={(event)=>{setFontFamily(event.target.value)}} value={fontFamily}>
					<option>serif</option>
					<option>sans-serif</option>
					<option>monospace</option>
					<option>cursive</option>
					<option>fantasy</option>
				</Form.Control>

				<Form.Label>Legend Title</Form.Label>
				<Form.Control type="text" style={{width:"300px", marginLeft:"10px", marginBottom:"5px"}} onChange={(event)=>{setLegendTitle(event.target.value)}} value={legendTitle}/>
	
				<Form.Label>Legend Labels</Form.Label>
				
				{LegendInput()}
			</div>
			<div id="credits"></div> 
			<p>Map outline from simplemaps.com</p>
			<p>Colors from colorbrewer2.org</p>
			<p>SVG download from nytimes.github.io/svg-crowbar</p>
		</div>
	)
}


export default App;
