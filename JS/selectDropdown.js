/*
	Copyright MxNighthawk 2025. All Rights Reserved.
	Programmed by Jesus Barajas Torres / MxNighthawk.
*/

class Option
{
	index;
	detail;
	value;
	num;

	constructor(parent, index, optionImage, val = 0)
	{
		let element = parent.getElementsByClassName("option")[index];
		element.style.backgroundImage = `url('./Graphics/icons/${optionImage}.png')`;

		this.detail = element.style.backgroundImage;
		this.value = element.innerText;
		this.num = val;
	}
}
class Dropdown
{
	list;
	nameDisplay;
	options = [];
	active = false;
	selected;
	value;

	constructor(parent, options, capitalize = false)
	{
		if(capitalize)
			parent.style.textTransform = "uppercase";

		this.list = parent.getElementsByClassName("selectList")[0];
		this.options = options;

		this.nameDisplay = parent.getElementsByClassName("selectedName")[0];
		this.nameDisplay.style.backgroundImage = this.options[0].detail;

		this.SetValue(0);
	}

	DisplayList(forceOff = false)
	{
		if(forceOff)
			this.active = true;

		this.active = !this.active;
		this.list.style.setProperty("display", this.active ? "block" : "none");
	}
	
	SetValue(indx)
	{
		this.nameDisplay.innerText = this.options[indx].value;
		this.nameDisplay.style.backgroundImage = this.options[indx].detail;
		this.list.style.setProperty("display", "none");

		this.selected = this.options[indx].value;
		this.value = this.options[indx].num;
	}
}

let productAddSelect = document.getElementById("productMenu").getElementsByClassName("select");
let editorSelects = document.getElementsByClassName("controlTable")[0].getElementsByClassName("select");

let productDropdown = new Dropdown(productAddSelect[0], [
		new Option(productAddSelect[0], 0, "sticker"),
		new Option(productAddSelect[0], 1, "emoji"),
		new Option(productAddSelect[0], 2, "char_art"),
	], true);

let editorDropdowns = [
	new Dropdown(editorSelects[0], [
		new Option(editorSelects[0], 0, "sticker", 0.6),
		new Option(editorSelects[0], 1, "sticker", 0.8),
		new Option(editorSelects[0], 2, "sticker", 1),
	]),
	new Dropdown(editorSelects[1], [
		new Option(editorSelects[1], 0, "sticker", 0),
		new Option(editorSelects[1], 1, "sticker", 15),
	]),
	new Dropdown(editorSelects[2], [
		new Option(editorSelects[2], 0, "sticker", 0),
		new Option(editorSelects[2], 1, "sticker", 25),
		new Option(editorSelects[2], 2, "sticker", 50),
	]),
];

function DisableAllDropdowns()
{
	for (let index = 0; index < editorDropdowns.length; index++) {
		const element = editorDropdowns[index];
		element.DisplayList(true);
	}
}

window.onpageswap += DisableAllDropdowns();