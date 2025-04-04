/*
	Copyright MxNighthawk 2025. All Rights Reserved.
	Programmed by Jesus Barajas Torres / MxNighthawk.
*/

let productMenu = {
	menu: document.getElementById("productMenu"),
	controls: document.getElementById("productControl"),
	products: []
};
let setMenu = {
	menu: document.getElementById("setMenu"),
	controls: document.getElementById("setControl")
};
let itemMenu = {
	menu: document.getElementById("itemEditor"),
	controls: document.getElementById("itemControl")
};

// let animSlider = document.getElementsByClassName("slider")[0].getElementsByTagName('input')[0];

let lastMenu = null;
let focusedMenu = productMenu;

let calculatorBody = document.getElementById("estimatorBoundary");
let calculatorMode = document.getElementById("modeTitle");
let productCardStack = productMenu.menu.getElementsByClassName("cards")[0];
let itemStack = setMenu.menu.getElementsByClassName("cards")[0];

let initialPrice = 0;
let total = 0;
let setTotal = 0;

let deletePointer = null;

let loadSetPointer = null;
let productClassPionter = null;
let itemClassPointer = null;

class ControlRow
{
	totalDisplay;
	rowGroup;
	edit;
	del;

	constructor()
	{
		this.rowGroup = document.createElement('div');
		this.rowGroup.classList.add("controlRow");

		this.totalDisplay = document.createElement('p');
		this.totalDisplay.classList.add("total");

		this.edit = document.createElement('p');
		this.edit.classList.add("editButton");
		this.edit.innerText = "EDIT";

		this.del = document.createElement('p');
		this.del.classList.add("deleteButton");
		
		this.rowGroup.appendChild(this.totalDisplay);
		this.rowGroup.appendChild(this.edit);
		this.rowGroup.appendChild(this.del);
	}
}
class CardControl extends ControlRow
{
	constructor(classPointer, elementPointer, setPointer, menuIndx)
	{
		super();
		this.edit.addEventListener('click', () =>
		{
			loadSetPointer = setPointer;
			productClassPionter = classPointer;
			
			DisplaySetCards(true);
			SetFocusedMenu(menuIndx);
			TotalUp(1);
		});

		this.del.addEventListener('click', () =>
		{
			loadSetPointer = setPointer;
			deletePointer = elementPointer;
			productClassPionter = classPointer;
			
			for (let i = loadSetPointer.length - 1; i >= 0; i--) {
				const element = loadSetPointer[i].selfElement;
				element.remove();
			}

			productMenu.products.splice(productMenu.products.indexOf(productClassPionter), 1);
			deletePointer.remove();
			loadSetPointer = [];

			TotalUp(0);
		});
	}
}
class ItemControl extends ControlRow
{
	constructor(classPointer, elementPointer, menuIndx)
	{
		super();
		this.edit.addEventListener('click', () =>
		{
			editorSelects[0].style.setProperty("display", productClassPionter.prodName == "CHARACTER ART" ? "block" : "none");
			editorSelects[1].style.setProperty("display", productClassPionter.prodName == "CHARACTER ART" ? "block" : "none");
			editorSelects[2].style.setProperty("display", productClassPionter.prodName == "CHARACTER ART" ? "block" : "none");
			itemClassPointer = classPointer;

			TotalUp(2);
			SetFocusedMenu(menuIndx);
		});

		this.del.addEventListener('click', () =>
		{
			deletePointer = elementPointer;
			itemClassPointer = classPointer;
			
			deletePointer.remove();
			loadSetPointer.splice(loadSetPointer.indexOf(deletePointer), 1);
			TotalUp(1);
		});
	}
}

class Card
{
	selfElement;
	compoundedimage;
	description;
	cost = 0;

	graphic;
	
	constructor()
	{
		this.description = document.createElement('textarea');
		this.description.autocomplete = "off";
		this.description.classList.add("manualProductDesc");
		
		this.selfElement = document.createElement('div');
		this.graphic = document.createElement('div');
		this.graphic.classList.add("graphicPreview");
	}
}
class ProductCard extends Card
{
	manualName;
	prodName;
	items = [];
	#row;

	constructor(productName, menuIndx)
	{
		super();
		this.selfElement.classList.add("productCard");
		this.prodName = productName;

		let field = document.createElement('div');
		field.classList.add("fieldGrid");
		field.appendChild(this.graphic);
		this.graphic.innerHTML +=
		`
			<p class="productName">${productName}</p>
		`;

		switch(productName)
		{
			case "STICKER SET":
				this.graphic.style.backgroundImage = "url('../Graphics/icons/sticker.png')";
			break;
			case "EMOJI SET":
				this.graphic.style.backgroundImage = "url('../Graphics/icons/emoji.png')";
			break;
			case "CHARACTER ART":
				this.graphic.style.backgroundImage = "url('../Graphics/icons/char_art.png')";
			break;
		}
		
		this.manualName = document.createElement('input');
		this.manualName.classList.add("manualProductName");
		this.manualName.autocomplete = "off";
		this.manualName.placeholder = "Name your product...";
		
		this.description.placeholder = "Describe your commission in general...";
		field.appendChild(this.manualName);
		field.appendChild(this.description);

		this.#row = new CardControl(this, this.selfElement, this.items, menuIndx);
		this.#row.totalDisplay.innerHTML = `$${this.cost.toFixed(2)}`;

		this.selfElement.appendChild(field);
		this.selfElement.appendChild(this.#row.rowGroup);
	};

	UpdateCost()
	{
		this.cost = 0;

		for (let i = 0; i < this.items.length; i++) {
			const element = this.items[i];
			this.cost += element.cost;
		}

		this.#row.totalDisplay.innerHTML = `$${this.cost.toFixed(2)}`;
	}
}
class ItemCard extends Card
{
	cropStyle = "head";
	lineStyle = "sketchy";
	colorStyle = "plain";
	motionStyle = "Static";
	startingPrice = 0;

	#row;

	constructor(menuIndx)
	{
		super();
		this.selfElement.classList.add("itemCard");

		let field = document.createElement('div');
		field.classList.add("fieldGrid");
		field.appendChild(this.graphic);

		switch(productClassPionter.prodName)
		{
			case "STICKER SET":
				this.graphic.style.backgroundImage = "url('../Graphics/previews/stickers/sticker.webp')";
				initialPrice = 16;
			break;
			case "EMOJI SET":
				this.graphic.style.backgroundImage = "url('../Graphics/previews/char_art/head_sketchy_plain.png')";
				initialPrice = 10;
			break;
			case "CHARACTER ART":
				this.graphic.style.backgroundImage = "url('../Graphics/previews/char_art/head_sketchy_plain.png')";
				initialPrice = 25;
			break;
		}

		let info = document.createElement("p");
		info.classList.add("styleInfo");

		if(productClassPionter.prodName != "CHARACTER ART")
			info.innerHTML = `&middot; ${this.motionStyle}`;
		else
			info.innerHTML = `&middot; ${this.cropStyle}, ${this.lineStyle}, ${this.colorStyle}, ${this.motionStyle}`;
		
		this.description.placeholder = "Describe the item...";
		field.appendChild(this.description);
		field.appendChild(info);

		this.startingPrice = initialPrice;
		this.cost = initialPrice;

		this.#row = new ItemControl(this, this.selfElement, menuIndx);
		this.#row.totalDisplay.innerHTML = `$${this.cost.toFixed(2)}`;

		this.selfElement.appendChild(field);
		this.selfElement.appendChild(this.#row.rowGroup);
	};

	UpdateCost(val)
	{
		this.cost = val;
		this.#row.totalDisplay.innerHTML = `$${this.cost.toFixed(2)}`;
	}
}

function SetFocusedMenu(id)
{
	lastMenu = focusedMenu;
	lastMenu.menu.style.setProperty("display", "none");
	lastMenu.controls.style.setProperty("display", "none");

	switch(id)
	{
		case 0:
			focusedMenu = productMenu;
			calculatorBody.style.setProperty("--frameColor", "#765400");
			calculatorBody.style.setProperty("--frameOutline", "#ffcc4a");
			calculatorMode.innerText = "Commission Estimator";
			break;
		case 1:
			focusedMenu = setMenu;
			calculatorBody.style.setProperty("--frameColor", "#007a4e");
			calculatorBody.style.setProperty("--frameOutline", "#00ffa3");
			calculatorMode.innerText = "Edit Comission...";
			break;
		case 2:
			focusedMenu = itemMenu;
			itemMenu.menu.getElementsByClassName("graphicPreview")[0].style.backgroundImage = itemClassPointer.graphic.style.backgroundImage;
			calculatorBody.style.setProperty("--frameColor", "#002f25");
			calculatorBody.style.setProperty("--frameOutline", "#00ffa3");
			calculatorMode.innerText = "Edit Item...";
			break;
	}
	
	focusedMenu.menu.style.setProperty("display", "block");
	focusedMenu.controls.style.setProperty("display", "grid");
}
function DisplaySetCards(showOrHide)
{
	for (let i = 0; i < loadSetPointer.length; i++) {
		const element = loadSetPointer[i].selfElement;
		element.style.setProperty("display", showOrHide ? "block" : "none");
	}
}

function TotalUp(id)
{
	total = 0;

	switch(id)
	{
		case 0:
			for (let i = 0; i < productMenu.products.length; i++) {
				const element = productMenu.products[i];
				total += element.cost;
			}

			productMenu.controls.getElementsByClassName("grandTotal")[0].innerHTML = `$${total.toFixed(2)}`;
			break;
		case 1:
			for (let i = 0; i < loadSetPointer.length; i++) {
				const element = loadSetPointer[i];
				total += element.cost;
			}

			setMenu.controls.getElementsByClassName("grandTotal")[0].innerHTML = `$${total.toFixed(2)}`;
			break;
		case 2:
			console.log(itemClassPointer.startingPrice);
			
			// itemClassPointer.motionStyle = animSlider.selected;
			
			if(productClassPionter.prodName == "CHARACTER ART")
			{
				itemClassPointer.cropStyle = editorDropdowns[0].selected;
				itemClassPointer.lineStyle = editorDropdowns[1].selected;
				itemClassPointer.colorStyle = editorDropdowns[2].selected;

				total = (itemClassPointer.startingPrice + editorDropdowns[1].value + editorDropdowns[2].value) * editorDropdowns[0].value;
			}
			else
				total = itemClassPointer.startingPrice;
		
			itemMenu.controls.getElementsByClassName("grandTotal")[0].innerHTML = `$${total.toFixed(2)}`;
			break;
	}
}

function AddCard()
{
	let newProduct = new ProductCard(productDropdown.nameDisplay.innerText, 1);
	productCardStack.appendChild(newProduct.selfElement);
	productMenu.products.push(newProduct);
}
function AddItem()
{
	let newItem = new ItemCard(2);
	itemStack.appendChild(newItem.selfElement);
	loadSetPointer.push(newItem);

	TotalUp(1);
}

TotalUp(0);