//
//	COPYRIGHT NIGHTHAWK 2024. ALL RIGHTS RESERVED.
//	PROGRAMMED BY: JESUS BARAJAS (AKA MXNIGHTHAWK / NIGHTHAWK / NIGHTHAWKDEV)
//

let editor = document.getElementById("editor");
let matrix = document.getElementById("editorView");

let typeName = document.getElementById("typeName");
let price = document.getElementById("estimatePrice");

let characterType = document.getElementById("charCount");
let lightingType = document.getElementById("lighting");

let addCells = document.getElementById("addCell");
let deleteCells = document.getElementById("deleteCell");
let selectAll = document.getElementById("selectCell");
let deselectAll = document.getElementById("deselectCell");

let checkoutTitle = document.getElementById("estimateTotal");
let checkoutList = document.getElementById("commissionList");
let checkoutAdd = document.getElementById("addToTotal");
let checkoutClear = document.getElementById("clearEstimate");

let range = checkoutTitle.getElementsByTagName("h2")[0];
let checkoutCounter = document.getElementById("listCounter");

let typeID = 0;
let cells = [];
let selectedCells = [];

let limits = [
	9,
	4,
];

let estimate = 0;
let baseCell = [
	2.75,
	2.75,
	2.75,
	2.5,
	2.5,
	2.5,
	2.25,
	2.25,
	2.25,
];
let baseEvent = [
	5,
	5,
	4,
	4,
];

let totalRange = 0;
let totalParts = [];

let addFrames = [
	{
		transform: "scale(0.9)",
		opacity: "0.5"
	},
	{
		transform: "scale(1.02)",
		opacity: "0.5"
	},
	{
		transform: "scale(1)",
		opacity: "1"
	},
];
let deleteFrames = [
	{
		transform: "scale(1)",
		opacity: "1"
	},
	{
		transform: "scale(0.5)",
		opacity: "0"
	},
];
let bounceFrames = [
	{
		transform: "scale(0.9)"
	},
	{
		transform: "scale(1)"
	},
];

let cellTiming =
{
	duration: 250,
	iterations: 1,
	easing: "ease"
};
let deleteTime =
{
	duration: 200,
	iterations: 1,
	easing: "ease",
	fill: "forwards"
};

let outlines = [
	"solid",
	"solid",
	"distortion",
	"magic",
	"fluid",
	"fire"
];

class Sticker
{
	lightingType;
	charactersPresent;

	cell;
	#light;
	#outline;
	#location;

	stopCheck;
	metaData;

	constructor()
	{
		this.lightingType = 1;
		this.charactersPresent = 1;

		let template = document.createElement('div');
		template.classList.add("template");
		
		this.cell = document.createElement('div');
		this.cell.classList.add("stickerCell");
		this.cell.append(template);
		
		this.#light = document.createElement('div');
		this.#light.classList.add("imagePart");
		this.#light.style.setProperty("background-image", `url("./Graphics/Templates/Stickers/1char/lit.webp")`);
		template.append(this.#light);

		this.cell.addEventListener("click", () =>
		{
			this.SetCellSelection();
		});

		if(selectedCells.length > 0)
			this.cell.style.setProperty("opacity", 0.4);

		matrix.append(this.cell);
		this.ReadMetadata();
	}

	Destroy()
	{
		this.cell.animate(deleteFrames, deleteTime);

		setTimeout(() => {
			this.cell.remove();
		}, 150);
	}

	SetCellSelection()
	{
		if(this.stopCheck)
			return;

		this.cell.animate(bounceFrames, cellTiming);

		if(!this.cell.classList.contains("selectedCell"))
		{
			this.cell.classList.add("selectedCell");
			selectedCells.push(this);
		}
		else
		{
			this.cell.classList.remove("selectedCell");
			selectedCells.splice(selectedCells.indexOf(this), 1);
		}

		if(selectedCells.length == 1)
			ReadFirstCell();

		this.cell.style.setProperty("opacity", this.cell.classList.contains("selectedCell") ? 1 : 0.4);

		if(selectedCells.length <= 1)
			SetHighlightingMap();

		SetEditorParamaterStyles();
	}
	PriceFromSticker(index)
	{
		let basePrice = typeID == 0 ? baseCell[index] : baseEvent[index];
		let lDisc = basePrice - basePrice * (this.lightingType - 1) * 0.15;
		let customOut = lDisc + lDisc * ((this.charactersPresent - 1) * 0.2);
		
		return customOut + customOut;
	}

	ReadMetadata()
	{
		this.metaData = `
			${characterType[this.charactersPresent].value}, ${lightingType[this.lightingType].value}
		`;
	}
	SetLightLayer()
	{
		this.#location = this.charactersPresent == 2 ? "2chars" : "1char";
		
		this.#light.style.setProperty("background-image", `url("./Graphics/Templates/Stickers/${this.#location}/${this.lightingType != 1 ? "unlit" : "lit"}.webp")`);
	}
}
class SAC extends Sticker
{
	description;
	descBox;

	boxIsSelected;
	boxMeta;

	constructor(information)
	{
		super();
		this.description = information;

		let descBox = document.createElement('input');
		descBox.type = "text";
		descBox.autocomplete = "off";
		descBox.placeholder = "Describe the event in the sticker.";
		descBox.classList.add("descriptionBox");

		this.cell.appendChild(descBox);
		this.boxMeta = `EVENT: <u>No Description Given</u>`;

		descBox.addEventListener("focus", () =>
		{
			if(this.cell.classList.contains("selectedCell"))
			{
				this.stopCheck = true;
				this.IsolateCell();
				return;
			}

			this.SetCellSelection();
			this.IsolateCell();
			this.stopCheck = true;
		});
		descBox.addEventListener("blur", () =>
		{
			if(descBox.innerText == "")
				this.boxMeta = `EVENT: <u>${descBox.value}</u>`;
			else
				this.boxMeta = `EVENT: <u>No Description Given</u>`;

			this.stopCheck = false;
		});
		descBox.addEventListener("keypress", (e) =>
		{
			if(e.key == "Enter")
			{
				descBox.blur();
				this.stopCheck = false;
				this.SetCellSelection();
			}
		});
	}

	IsolateCell()
	{
		if(selectedCells.length > 1)
		{
			for (let i = 0; i < selectedCells.length; i++) {
				const element = selectedCells[i];

				if(element.cell != this.cell)
				{
					element.cell.classList.remove("selectedCell");
					element.cell.style.setProperty("opacity", element.cell.classList.contains("selectedCell") ? 1 : 0.4);
				}
			}

			selectedCells = [this];
			this.cell.animate(bounceFrames, cellTiming);
			SetHighlightingMap();
			ReadFirstCell();
			SetEditorParamaterStyles();
		}
	}
}
class Change
{
	instance;
	estimate;

	constructor()
	{
		this.instance = document.createElement('details');
		this.instance.classList.add("editorChange");
		this.estimate = estimate;

		let buttonPurge = document.createElement('button');
		buttonPurge.classList.add("purgeChange");
		buttonPurge.innerText = "x";
		buttonPurge.addEventListener("click", () =>
		{
			this.instance.animate(deleteFrames, deleteTime);

			setTimeout(() => {
				this.instance.remove();
				totalParts.splice(totalParts.indexOf(this), 1);

				SetRangeStyles();
				CalculateRange();
			}, 200);
		});

		let partSummary = document.createElement('summary');
		partSummary.innerText += `${typeName.value} - $${estimate.toFixed(2)}`;
		partSummary.append(buttonPurge);

		totalParts.push(this);

		let descriptors = document.createElement('article');
		let header = document.createElement('h3');
		let changes = document.createElement('ul');

		header.innerText = `${cells[0].constructor.name} x${cells.length}`;
		for (let i = 0; i < cells.length; i++) {
			const element = cells[i];

			if(typeID == 1)
				changes.innerHTML += `<li>${element.boxMeta}<br>${element.metaData}</li>`;
			else
				changes.innerHTML += `<li>${element.metaData}</li>`;
		}

		descriptors.append(header);
		descriptors.append(changes);

		this.instance.append(partSummary);
		this.instance.append(descriptors);
		this.instance.animate(addFrames, cellTiming);
		CalculateRange();
	}
}

function SetParameters(l, c)
{
	if(l)
		for(let i = 0; i < selectedCells.length; i++)
		{
			selectedCells[i].lightingType = lightingType.selectedIndex;
			selectedCells[i].SetLightLayer();
		}

	if(c)
		for(let i = 0; i < selectedCells.length; i++)
		{
			selectedCells[i].charactersPresent = characterType.selectedIndex;
			selectedCells[i].SetLightLayer();
			selectedCells[i].SetOutlineLayer();
		}

	for (let i = 0; i < selectedCells.length; i++) {
		const element = selectedCells[i];

		element.ReadMetadata();
	}

	UpdateCells();
}
function SetEditorParamaterStyles()
{
	lightingType.style.setProperty("opacity", selectedCells.length == 0 ? 0.25 : 1);
	characterType.style.setProperty("opacity", selectedCells.length == 0 ? 0.25 : 1);

	editor.style.setProperty("--selectStates", selectedCells.length == 0 ? "none" : "initial");

	addCells.style.setProperty("opacity", cells.length == limits[typeID] ? 0.25 : 1);
	deleteCells.style.setProperty("opacity", cells.length == 1 ? 0.25 : 1);

	selectAll.style.setProperty("opacity", selectedCells.length == cells.length ? 0.25 : 1);
	deselectAll.style.setProperty("opacity", selectedCells.length == 0 ? 0.25 : 1);

	if(selectedCells.length == 0)
	{
		characterType.selectedIndex = 0;
		lightingType.selectedIndex = 0;
	}
}

function ReadFirstCell()
{
	lightingType.selectedIndex = selectedCells[0].lightingType;
	characterType.selectedIndex = selectedCells[0].charactersPresent;
}
function AddCell()
{
	if(cells.length == limits[typeID])
		return;

	let type = null;
	switch(typeID)
	{
		case 0: type = new Sticker();
		break;
		case 1: type = new SAC("");
		break;
	}

	cells.push(type);
	type.cell.animate(addFrames, cellTiming);
	estimate += cells[cells.length - 1].PriceFromSticker(cells.length - 1);
	UpdateCells();
}
function DeleteCells()
{
	if(cells.length == 1)
		return;

	if(selectedCells.length > 0)
	{
		let allPicked = selectedCells.length == cells.length;

		for (let i = 0; i < selectedCells.length; i++) {
			const element = selectedCells[i];
			element.Destroy();

			cells.splice(cells.indexOf(element), 1);
		}
		
		lightingType.selectedIndex = characterType.selectedIndex = 0;
		selectedCells = [];

		if(allPicked)
			setTimeout(() => {
				AddCell();
			}, 200);
	}
	else
	{
		cells[cells.length - 1].Destroy();
		cells.pop();
	}

	estimate = 0;

	for (let i = 0; i < cells.length; i++) {
		estimate += cells[i].PriceFromSticker(i);
	}

	setTimeout(() => {
		UpdateCells();
	}, 200);
	SetHighlightingMap();
}
function DeselectAll()
{
	if(selectedCells.length == 0)
		return;

	for (let i = 0; i < cells.length; i++) {
		const element = cells[i];
		element.cell.classList.remove("selectedCell");
		element.cell.style.setProperty("opacity", 1);
		element.cell.animate(bounceFrames, cellTiming);
	}

	selectedCells = [];
	SetEditorParamaterStyles();
}
function SelectAll()
{
	if(selectedCells.length == cells.length)
		return;

	selectedCells = [];
	for (let i = 0; i < cells.length; i++) {
		const element = cells[i];

		if(!element.cell.classList.contains("selectedCell"))
		{
			element.cell.classList.add("selectedCell");
			element.cell.style.setProperty("opacity", 1);
			element.cell.animate(bounceFrames, cellTiming);
		}

		selectedCells.push(element);
	}

	SetEditorParamaterStyles();
}

function SetHighlightingMap()
{
	for (let i = 0; i < cells.length; i++) {
		const element = cells[i];

		if(selectedCells.length == 1 && !element.cell.classList.contains("selectedCell"))
			element.cell.style.setProperty("opacity", 0.4);
		else
			element.cell.style.setProperty("opacity", 1);
	}
}
function SetPrice()
{
	estimate = 0;

	for (let i = 0; i < cells.length; i++) {
		estimate += cells[i].PriceFromSticker(i);
	}

	price.innerText = `ESTIMATE: $${estimate.toFixed(2)}`;
}
function UpdateCells()
{
	SetPrice();
	SetEditorParamaterStyles();

	if(typeID != 0)
		return;

	let rounded = parseInt(cells.length / 3);
	let maxWidth = "90%";

	if(rounded == 1)
		maxWidth = "40%";
	else if(rounded > 1)
		maxWidth = "30%";
	
	matrix.style.setProperty("--cellHeight", maxWidth);
}

function SelectCommission()
{
	selectedCells = [];
	for (let i = 0; i < cells.length; i++) {
		const element = cells[i];
		element.cell.remove();
	}

	typeID = typeName.selectedIndex;

	cells = [];
	editor.classList = [];
	editor.classList.add(typeID == 0 ? "MatrixMode" : "ColumnMode");

	AddCell();
	SetEditorParamaterStyles();
}

function SetRangeStyles()
{
	checkoutAdd.style.setProperty("opacity", totalParts.length < 4 ? 1 : 0.25);
	checkoutClear.style.setProperty("opacity", totalParts.length > 0 ? 1 : 0.25);
}
function AddToReceipt()
{
	if(checkoutList.children.length == 4)
		return;

	checkoutList.append(new Change().instance);
	SetRangeStyles();
}
function ClearReceipt()
{
	for (let i = checkoutList.children.length - 1; i >= 0; i--) {
		const element = checkoutList.children[i];
		element.animate(deleteFrames, deleteTime);
	}

	setTimeout(() => {
		for (let i = checkoutList.children.length - 1; i >= 0; i--) {
			const element = checkoutList.children[i];
			checkoutList.removeChild(element);
		}

		totalParts = [];
		totalRange = 0;
	
		range.innerText = "ESTIMATE RANGE: $00.00 - $00.00";
		checkoutCounter.innerText = "0 / 4";
		SetRangeStyles();
	}, 200);
}
function CalculateRange()
{
	totalRange = 0;

	for (let i = 0; i < totalParts.length; i++) {
		const element = totalParts[i].estimate;
		totalRange += element;
	}

	range.innerText = `ESTIMATE RANGE: $${totalRange.toFixed(2)} - $${(totalRange + (totalRange * 0.2)).toFixed(2)}`;

	checkoutCounter.innerText = `${totalParts.length} / 4`;
}