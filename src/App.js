import './App.css';
import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import colorbrewer from 'colorbrewer'
import Svg from './Svg'
import states from './data.js'
import fileDownload from 'js-file-download'
import {saveSvgAsPng} from 'save-svg-as-png';

const fillMap = () => {
	let temp = new Map()
	states.forEach((state)=>{
		temp.set(state.id, 0);
	})
	return temp
}

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

	const updateLegend = (index, text) => {
		let temp = [...legend];
		temp[index]=text;
		setLegend(temp)
	}

	const updateValues = (key, value) => {
		setValues((prev) => new Map(prev).set(key, value));
	}

	const downloadSvg = () => {
		fileDownload(document.getElementById("map").outerHTML, `${title}-us-map-maker.svg`);

	}


	const LegendInput = () => {
		let temp = []
		for (let i=excludeNoData; i<=categories; ++i){
			temp.push(<Form.Control key={i} style={{width:"300px", marginLeft:"10px", marginBottom:"5px"}}
			 type="text" value={legend[i]} maxLength="12" onChange={(event)=>{updateLegend(i, event.target.value)}} />)
		}
		return temp;
	}

	const fillValuesFromCsv = (file) => {
		if(file===""){return;}
		try {
			let reader = new FileReader();
			reader.readAsText(file);
			reader.onload = (e) => {	
				let str = (reader.result).toString();

				let col = color;
				let cats = categories;
				let titl = title;
				let exNoData = excludeNoData;

				str.split("\n").forEach(line => {
					const splitLine = line.split(",")
					const key = splitLine[0]
					const val = splitLine[1]
					switch (key){
						case "categories": cats = parseInt(val); break;
						case "color": col = val.trim(); break;
						case "title": titl = val; break;
						case "excludeNoData": exNoData = parseInt(val); break;
						default: updateValues(key, val);
					}
				})
				updateScheme(col, cats)
				setTitle(titl);
				setExcludeNoData(exNoData)
			}
			alert("File Uploaded!");
		}
		catch(exception){
			alert("Upload a file in the correct format");
		}
		finally{

		}
	}

	const generateCsv = () => {
		let out = "";
		out+= `title,${title}\n`
		out+= `color,${color}\n`
		out+= `categories,${categories}\n`
		out+= `excludeNoData,${excludeNoData}\n`

		values.forEach((val, stateId)=>{
			out+= `${stateId},${val}\n`
		})

		return out;
	}

	const exportToCsv = () => {
		fileDownload(generateCsv(), `${title}-us-map-maker.csv`);
	}

	const downloadAsPng = () => {
		saveSvgAsPng(document.getElementById("map"), `${title}-us-map-maker.png`, {top: -50});
	}
	

	return(
		<div>
			<div id="mapsplit">
				<h1>stats</h1>
				<Form.File id="dataImport" label="Import data" accept="text/csv" onChange={(event) => {setCsvPath(event.target.files[0])}}/>
				<Button onClick={() => {fillValuesFromCsv(csvPath)}}>Import from csv</Button>
				<Button onClick={() => {exportToCsv()}}>Export to csv</Button>
				<br />
				<Button onClick={() => {downloadSvg()}}>Download as SVG</Button>
				<Button onClick={() => {downloadAsPng()}}>Download as PNG</Button>
				<br />
				<Svg colorScheme={colorScheme} title={title} legend={legend} excludeNoData={excludeNoData} backgroundColor={backgroundColor} values={values} updateValues={updateValues}
					states={states} id="map"/>
			</div>
			<div id="optionssplit">
				<Form.Label>sequential: </Form.Label>
				<br />
				<Button style={{color:"white", backgroundColor:"green", borderColor:"black"}} onClick={() => {updateScheme("Greens",categories)}}>green</Button>
				<Button style={{color:"white", backgroundColor:"red", borderColor:"black"}} onClick={() => {updateScheme("Reds",categories)}}>red</Button>
				<Button style={{color:"white", backgroundColor:"blue", borderColor:"black"}} onClick={() => {updateScheme("Blues",categories)}}>blue</Button>
				<Button style={{color:"white", backgroundColor:"darkgray", borderColor:"black"}} onClick={() => {updateScheme("Greys",categories)}}>gray</Button>
				<Button style={{color:"white", backgroundColor:"orange", borderColor:"black"}} onClick={() => {updateScheme("Oranges",categories)}}>orange</Button>
				<Button style={{color:"white", backgroundColor:"purple", borderColor:"black"}} onClick={() => {updateScheme("Purples",categories)}}>purple</Button>
				<br />
				<Form.Label>diverging: </Form.Label>
				<br />
				<Button style={{color:"white", backgroundColor:"blue", borderColor:"red"}} onClick={() => {updateScheme("RdBu",categories)}}>Red-White-Blue</Button>
				{/*<Button style={{color:"white", backgroundColor:"darkgray", borderColor:"red"}} onClick={() => {updateScheme("RdGy",categories)}}>Red-Gray</Button>
				<Button style={{color:"yellow", backgroundColor:"blue", borderColor:"red"}} onClick={() => {updateScheme("RdYlBu",categories)}}>Red-Yellow-Blue</Button>
				<Button style={{color:"yellow", backgroundColor:"red", borderColor:"green"}} onClick={() => {updateScheme("RdYlGn",categories)}}>Red-Yellow-Green</Button>
				<Button style={{color:"yellow", backgroundColor:"red", borderColor:"blue"}} onClick={() => {updateScheme("Spectral",categories)}}>Spectral</Button>
				<Button style={{color:"white", backgroundColor:"purple", borderColor:"orange"}} onClick={() => {updateScheme("PuOr",categories)}}>Orange-Purple</Button>
				<Button style={{color:"white", backgroundColor:"green", borderColor:"purple"}} onClick={() => {updateScheme("PRGn",categories)}}>Purple-Green</Button>
				<Button style={{color:"white", backgroundColor:"green", borderColor:"pink"}} onClick={() => {updateScheme("PiYG",categories)}}>Pink-Yellowgreen</Button>
				<Button style={{color:"white", backgroundColor:"brown", borderColor:"blue"}} onClick={() => {updateScheme("BrBG",categories)}}>Brown-Bluegreen</Button>*/}
				<br />
				<Form.Label>qualitative: </Form.Label>
				<br />
				<Button style={{color:"white", backgroundColor:"#e41a1c", borderColor:"#377eb8"}} onClick={() => {updateScheme("Set1",categories)}}>dark A</Button>
				<Button style={{color:"white", backgroundColor:"#fbb4ae", borderColor:"#b3cde3"}} onClick={() => {updateScheme("Pastel1",categories)}}>pastel A</Button>
				<Button style={{color:"white", backgroundColor:"#8dd3c7", borderColor:"#ffffb3"}} onClick={() => {updateScheme("Set3",categories)}}>light</Button>
				
				<Form.Check type="checkbox" label="Exclude 'No data'" onChange={() => {setExcludeNoData((1-excludeNoData)%2)}} checked={excludeNoData} />
	
				<Form.Label>categories</Form.Label>
	
				<Form.Control as="select" style={{width:"300px", marginLeft:"10px", marginBottom:"5px"}} onChange={(event)=>{updateScheme(color, parseInt(event.target.value))}} value={categories}>
    				<option>3</option>
    				<option>4</option>
    				<option>5</option>
    				<option>6</option>
    				<option>7</option>
    				<option>8</option>
    				<option>9</option>
    			</Form.Control>
	
				<Form.Label>title</Form.Label>
				<Form.Control type="text" style={{width:"300px", marginLeft:"10px", marginBottom:"5px"}} onChange={(event)=>{setTitle(event.target.value)}} value={title}/>
	
				<Form.Label>Background Color</Form.Label>
				<span style={{backgroundColor:backgroundColor, width:"30px", height:"30px"}}/>
				<Form.Control type="text" style={{width:"300px", marginLeft:"10px", marginBottom:"5px"}} onChange={(event)=>{setBackgroundColor(event.target.value)}} value={backgroundColor}/>
	
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
