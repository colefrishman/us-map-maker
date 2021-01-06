import './App.css';
import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import colorbrewer from 'colorbrewer'
import Svg from './Svg'

function App() {
	const [title, setTitle] = useState("Title");
	const [color, setColor] = useState("Reds");
	const [categories, setCategories] = useState(3);
	const [colorScheme, setColorScheme] = useState(["#aaaaaa", "#fee0d2", "#fc9272", "#de2d26"]); 
	const [excludeNoData, setExcludeNoData] = useState(0);
	const [legend, setLegend] = useState(["No data", "Cat. 1", "Cat. 2", "Cat. 3", "Cat. 4", "Cat. 5", "Cat. 6", "Cat. 7", "Cat. 8", "Cat. 9"]); 

	const updateScheme = (colr, cats) => {
		setColor(colr);
		setCategories(cats);
		let tempScheme = colorbrewer[colr][cats];
		
		if(tempScheme[0] !== "#aaaaaa" && colr !== "Greys"){
			tempScheme.unshift("#aaaaaa");
		}
		else if(tempScheme[0] !== "#ffffff" && colr === "Greys"){
			tempScheme.unshift("#ffffff");
		}

		
		setColorScheme(tempScheme);
	}

	const updateLegend = (index, text) => {
		let temp = [...legend];
		temp[index]=text;
		setLegend(temp)
	}

	const downloadSvg = () => {
		let e = document.createElement('script');
		e.setAttribute('src', 'https://nytimes.github.io/svg-crowbar/svg-crowbar.js');
		e.setAttribute('class', 'svg-crowbar');
		document.body.appendChild(e);
	}


	const LegendInput = () => {
		let temp = []
		for (let i=excludeNoData; i<categories+1; ++i){
			temp.push(<Form.Control type="text" value={legend[i]} maxLength="16" onChange={(event)=>{updateLegend(i, event.target.value)}} />)
		}
		return temp;
	}
	
	return(
		<div>
			<h1>stats</h1>
			<Button onClick={() => {downloadSvg()}}>Download as SVG</Button>
			<br />
			<Svg colorScheme={colorScheme} title={title} legend={legend} excludeNoData={excludeNoData}/>
			<br />
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
			<Button style={{color:"white", backgroundColor:"blue", borderColor:"red"}} onClick={() => {updateScheme("RdBu",categories)}}>election</Button>
			<br />
			<Form.Label>qualitative: </Form.Label>
			<br />
			<Button style={{color:"white", backgroundColor:"#e41a1c", borderColor:"#377eb8"}} onClick={() => {updateScheme("Set1",categories)}}>dark A</Button>
			<Button style={{color:"white", backgroundColor:"#fbb4ae", borderColor:"#b3cde3"}} onClick={() => {updateScheme("Pastel1",categories)}}>pastel A</Button>
			<Button style={{color:"white", backgroundColor:"#8dd3c7", borderColor:"#ffffb3"}} onClick={() => {updateScheme("Set3",categories)}}>light</Button>
			
			<Form.Check type="checkbox" label="Exclude 'No data' checkbox" onChange={() => {setExcludeNoData(1-excludeNoData)}} checked={excludeNoData} />
			<Form.Label>categories</Form.Label>

			<Form.Control as="select" onChange={(event)=>{updateScheme(color, event.target.value)}} value={categories}>
    			<option>3</option>
    			<option>4</option>
    			<option>5</option>
    			<option>6</option>
    			<option>7</option>
    			<option>8</option>
    			<option>9</option>
    		</Form.Control>
			
			<Form.Label>title</Form.Label>
			<Form.Control type="text" onChange={(event)=>{setTitle(event.target.value)}} value={title}/>

			<Form.Label>Legend Labels</Form.Label>
			
			{LegendInput()}

			<p>Map outline from simplemaps.com</p>
			<p>Colors from colorbrewer2.org</p>
			<p>SVG download from nytimes.github.io/svg-crowbar</p>
		</div>
	)
}


export default App;
