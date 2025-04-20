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

let animSlider = document.getElementsByClassName("slider")[0].getElementsByTagName('input')[0];
let numberDisplay = document.getElementsByClassName("slider")[0].getElementsByClassName('sliderValue')[0];

animSlider.addEventListener('input', () =>
{
	numberDisplay.textContent = `${animSlider.value}s`;
	itemClassPointer.motionID = animSlider.value;
	TotalUp(2);
});

let lastMenu = null;
let focusedMenu = productMenu;

let invoiceBttn = document.getElementById("invoiceButton");
let aliasInput = document.getElementById("alias");
invoiceBttn.style.opacity = "0.25";
aliasInput.addEventListener('input', () =>
{
	CheckDownloadability();
});

let calculatorBody = document.getElementById("estimatorBoundary");
let calculatorMode = document.getElementById("modeTitle");
let productCardStack = productMenu.menu.getElementsByClassName("cards")[0];
let itemStack = setMenu.menu.getElementsByClassName("cards")[0];

let initialPrice = 0;
let total = 0;
let setTotal = 0;

let delElemPointer = null;

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
			delElemPointer = elementPointer;
			productClassPionter = classPointer;
			
			for (let i = loadSetPointer.length - 1; i >= 0; i--) {
				const element = loadSetPointer[i].selfElement;
				element.remove();
			}

			loadSetPointer = [];
			delElemPointer.remove();
			productMenu.products.splice(productMenu.products.indexOf(productClassPionter), 1);
			
			CheckDownloadability();
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
			characterParmaters[0].element.style.setProperty("display", productClassPionter.prodName == "CHARACTER ART" ? "block" : "none");
			characterParmaters[1].element.style.setProperty("display", productClassPionter.prodName == "CHARACTER ART" ? "block" : "none");
			characterParmaters[2].element.style.setProperty("display", productClassPionter.prodName == "CHARACTER ART" ? "block" : "none");
			itemClassPointer = classPointer;
			
			characterParmaters[0].SetDisplayValue(itemClassPointer.cropID);
			characterParmaters[1].SetDisplayValue(itemClassPointer.lineID);
			characterParmaters[2].SetDisplayValue(itemClassPointer.colorID);
			
			animSlider.max = productClassPionter.prodName == "CHARACTER ART" ? 10 : 3;
			animSlider.value = itemClassPointer.motionID;
			numberDisplay.textContent = `${animSlider.value}s`;

			TotalUp(2);
			SetFocusedMenu(menuIndx);
		});

		this.del.addEventListener('click', () =>
		{
			if(loadSetPointer.length == 1)
				return;
			
			itemClassPointer = classPointer;
			delElemPointer = elementPointer;
			
			loadSetPointer.splice(loadSetPointer.indexOf(itemClassPointer), 1);
			delElemPointer.remove();

			if(loadSetPointer.length == 1)
				loadSetPointer[0].row.del.style.opacity = "0.25";
			
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
	row;

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
				this.graphic.style.backgroundImage = "url('./Graphics/icons/sticker.webp')";
			break;
			case "EMOJI SET":
				this.graphic.style.backgroundImage = "url('./Graphics/icons/emoji.webp')";
			break;
			case "CHARACTER ART":
				this.graphic.style.backgroundImage = "url('./Graphics/icons/char_art.webp')";
			break;
		}
		
		this.manualName = document.createElement('input');
		this.manualName.classList.add("manualProductName");
		this.manualName.autocomplete = "off";
		this.manualName.placeholder = "Name your product...";
		
		this.description.placeholder = "Describe your commission in general...";
		field.appendChild(this.manualName);
		field.appendChild(this.description);

		productClassPionter = this;
		loadSetPointer = this.items;

		this.row = new CardControl(this, this.selfElement, this.items, menuIndx);
		this.row.totalDisplay.innerHTML = `$${this.cost.toFixed(2)}`;

		this.selfElement.appendChild(field);
		this.selfElement.appendChild(this.row.rowGroup);
		
		let newItem = new ItemCard();
		itemStack.appendChild(newItem.selfElement);
		this.items.push(newItem);
		
		DisplaySetCards(false);
		TotalUp(1);

		this.UpdateCost();
		this.items[0].row.del.style.opacity = "0.25";
	};

	UpdateCost()
	{
		this.cost = 0;

		for (let i = 0; i < this.items.length; i++) {
			const element = this.items[i];
			this.cost += element.cost;
		}
		
		this.row.totalDisplay.innerHTML = `&euro;${this.cost.toFixed(2)}`;
	}
}
class ItemCard extends Card
{
	cropID = 0;
	lineID = 0;
	colorID = 0;
	motionID = 0;

	startingPrice = 0;

	row;
	info;

	constructor()
	{
		super();
		this.selfElement.classList.add("itemCard");

		let field = document.createElement('div');
		field.classList.add("fieldGrid");
		field.appendChild(this.graphic);

		switch(productClassPionter.prodName)
		{
			case "STICKER SET":
				this.graphic.style.backgroundImage = "url('./Graphics/previews/stickers/sticker.webp')";
				initialPrice = 16 * 0.9;
			break;
			case "EMOJI SET":
				this.graphic.style.backgroundImage = "url('./Graphics/previews/emojis/emoji.webp')";
				initialPrice = 10 * 0.9;
			break;
			case "CHARACTER ART":
				this.graphic.style.backgroundImage = "url('./Graphics/previews/char_art/head_sketchy_plain.webp')";
				initialPrice = 25 * 0.9;
			break;
		}

		this.info = document.createElement("p");
		this.info.classList.add("styleInfo");
		this.UpdateInfo();

		this.description.placeholder = "Describe the item...";
		field.appendChild(this.description);
		field.appendChild(this.info);

		this.startingPrice = initialPrice;
		this.cost = initialPrice;

		this.row = new ItemControl(this, this.selfElement, 2);
		this.row.totalDisplay.innerHTML = `&euro;${this.cost.toFixed(2)}`;

		this.selfElement.appendChild(field);
		this.selfElement.appendChild(this.row.rowGroup);
	};

	UpdateCost(val)
	{
		this.cost = val;
		this.row.totalDisplay.innerHTML = `&euro;${this.cost.toFixed(2)}`;
	}
	
	UpdateInfo()
	{
		if(productClassPionter.prodName != "CHARACTER ART")
			this.info.innerHTML = `&middot; ${this.motionID}s`;
		else
		{
			this.info.innerHTML = `&middot; ${characterParmaters[0].display.innerText}, ${characterParmaters[1].display.innerText}, ${characterParmaters[2].display.innerText}, ${this.motionID}s`;
			this.graphic.style.backgroundImage = `url('./Graphics/previews/char_art/${characterParmaters[0].keys.get(this.cropID)}_${characterParmaters[1].keys.get(this.lineID)}_${characterParmaters[2].keys.get(this.colorID)}.webp')`;
		}
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
			calculatorMode.innerText = "Edit Commission...";
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

			productMenu.controls.getElementsByClassName("grandTotal")[0].innerHTML = `TOTAL &middot; &euro;${total.toFixed(2)}`;
			break;
		case 1:
			for (let i = 0; i < loadSetPointer.length; i++) {
				const element = loadSetPointer[i];
				total += element.cost;
			}

			setMenu.controls.getElementsByClassName("grandTotal")[0].innerHTML = `SET COST &middot; &euro;${total.toFixed(2)}`;
			break;
		case 2:
			if(productClassPionter.prodName == "CHARACTER ART")
			{
				itemClassPointer.cropID = characterParmaters[0].value;
				itemClassPointer.lineID = characterParmaters[1].value;
				itemClassPointer.colorID = characterParmaters[2].value;

				total = (itemClassPointer.startingPrice + characterParmaters[2].secondary[itemClassPointer.colorID] + characterParmaters[1].secondary[itemClassPointer.lineID]) * characterParmaters[0].secondary[itemClassPointer.cropID] * (1 + itemClassPointer.motionID * 0.8);
			}
			else
				total = itemClassPointer.startingPrice * (1 + itemClassPointer.motionID * 0.8);
			
			itemClassPointer.UpdateInfo();
			itemMenu.menu.getElementsByClassName("graphicPreview")[0].style.backgroundImage = itemClassPointer.graphic.style.backgroundImage;
			itemMenu.controls.getElementsByClassName("grandTotal")[0].innerHTML = `ITEM COST &middot; &euro;${total.toFixed(2)}`;
			break;
	}
}

function AddCard()
{
	let newProduct = new ProductCard(productDropdown.names[productDropdown.value], 1);
	productCardStack.appendChild(newProduct.selfElement);
	productMenu.products.push(newProduct);

	CheckDownloadability();
	TotalUp(0);
}
function AddItem()
{
	let newItem = new ItemCard();
	itemStack.appendChild(newItem.selfElement);
	loadSetPointer.push(newItem);
	
	productClassPionter.items[0].row.del.style.opacity = "1";

	TotalUp(1);
}
function CheckDownloadability()
{
	if(aliasInput.value != "" && productMenu.products.length > 0)
		invoiceBttn.style.opacity = "1";
	else
		invoiceBttn.style.opacity = "0.25";
}

TotalUp(0);

function PrintInvoice()
{
	if(invoiceBttn.style.opacity != "1")
		return;

	let requestDetails = document.getElementById("requestDetails");
	let ID = document.getElementById("requestID");
	let customerName = document.getElementById("customerName");
	let Time = new Date();

	let idNumber = (Time.getTime() / 1000).toFixed(0);

	ID.textContent = `ID: ${idNumber}`;
	customerName.textContent = aliasInput.value;

	if(requestDetails.children.length > 0)
		for (let c = requestDetails.children.length - 1; c >= 0; c--) {
			const element = requestDetails.children[c];
			element.remove();
		}

	for (let i = 0; i < productMenu.products.length; i++) {
		const product = productMenu.products[i];

		let productEntry = document.createElement('div');
		productEntry.classList.add("productEntry");

		let setTable = document.createElement('div');
		let titelRow = document.createElement('div');

		let setRow = document.createElement('div');
		setRow.classList.add("setRow");

		let setIcon = document.createElement('div');
		setIcon.classList.add("setIcon");
		
		switch(product.prodName)
		{
			case "STICKER SET":
				setIcon.style.backgroundImage = "url('./Graphics/icons/sticker_blk.webp')";
			break;
			case "EMOJI SET":
				setIcon.style.backgroundImage = "url('./Graphics/icons/emoji_blk.webp')";
			break;
			case "CHARACTER ART":
				setIcon.style.backgroundImage = "url('./Graphics/icons/char_art_blk.webp')";
			break;
		}

		setRow.appendChild(setIcon);
		setRow.innerHTML +=
		`
			<p class="setInfo">
				<b>${product.prodName} - ${product.manualName.value}</b>
				<br>${product.description.value}
			</p>
		`;

		setTable.appendChild(setRow);

		titelRow.innerHTML +=
		`
			<p>#</p>
			<p>DESCRIPTION</p>
			<p>STYLE</p>
			<p>PRICE</p>
		`;
		
		setTable.classList.add("setTable");
		titelRow.classList.add("titleRow");

		productEntry.appendChild(setTable);
		productEntry.appendChild(titelRow);
		
		for (let t = 0; t < product.items.length; t++) {
			const item = product.items[t];
			
			let informationRow = document.createElement('div');
			informationRow.innerHTML +=
			`
				<p></p>
				<p></p>
				<p></p>
				<p></p>
			`;

			informationRow.classList.add("informationRow");
			let pS = informationRow.getElementsByTagName('p');

			pS[0].textContent = t + 1;
			pS[1].textContent = item.description.value;
			pS[2].innerHTML = item.info.innerHTML;
			pS[3].textContent = `${item.cost.toFixed(2)}`;

			productEntry.appendChild(informationRow);
		}

		let setTotal = document.createElement('p');
		setTotal.classList.add("setTotal");
		setTotal.innerHTML = `PRODUCT TOTAL: &euro;${product.cost.toFixed(2)}`;

		productEntry.appendChild(setTotal);
		requestDetails.appendChild(productEntry);
	}

	let totalPrice = document.getElementById("invoiceTotal");
	totalPrice.innerHTML = `TOTAL ESTIMATE: &euro;${total.toFixed(2)}`;

	let stamps = document.getElementById("timestamp");
	stamps.textContent = Time;

	let clone = document.getElementById("print");
	
	let pdfOptions = {
		filename: `commission_request_${idNumber}.pdf`,
		html2canvas : { scale: 1 },
		pagebreak: { mode: ['avoid-all', 'legacy']} 
	};

	html2pdf().set(pdfOptions).from(clone.innerHTML).save();
}
