/*
	Copyright MxNighthawk 2025. All Rights Reserved.
	Programmed by Jesus Barajas Torres / MxNighthawk.
*/

class NewDropdown
{
	keys;
	names = [];
	secondary = [];
	imgs = [];

	element;
	display;
	internalList;
	value;

	constructor(parent, totalID, keyList, nameList, images, secondaryValues = null)
	{
		this.keys = keyList;
		this.names = nameList;
		this.secondary = secondaryValues;
		this.imgs = images;
		this.value = 0;

		this.element = document.createElement('div');
		this.element.classList.add("select");
		this.element.addEventListener('mouseleave', () =>
		{
			this.internalList.style.display = "none";
		});

		this.display = document.createElement('p');
		this.display.classList.add('selectedName');
		this.display.addEventListener('click', () =>
		{
			this.internalList.style.display = "block";
		});
		this.display.style.backgroundImage = `url('./Graphics/icons/${this.imgs[0]}.png')`;
		this.display.innerText = this.names[0];

		this.internalList = document.createElement('div');
		this.internalList.classList.add("selectList");

		for (let i = 0; i < this.keys.size; i++) {
			let option = document.createElement('div');

			option.classList.add("option");
			
			option.style.backgroundImage = `url('./Graphics/icons/${this.imgs[i]}.png')`;
			option.innerText = this.names[i];

			option.addEventListener('click', () =>
			{
				this.SetDisplayValue(i);
				TotalUp(totalID);
			});
			
			this.internalList.appendChild(option);
		}
		
		this.element.appendChild(this.display);
		this.element.appendChild(this.internalList);
		parent.appendChild(this.element);
	}

	SetDisplayValue(indx)
	{
		this.value = indx;
		this.display.innerText = this.names[indx];
		this.internalList.style.display = "none";
		this.display.style.backgroundImage = `url('./Graphics/icons/${this.imgs[indx]}.png')`;
	}
}

let productAddSelect = document.getElementById("productMenu").getElementsByClassName("fieldGrid")[0];
let editorSelects = document.getElementsByClassName("controlTable")[0];

let characterParmaters = [
	new NewDropdown(
		editorSelects,
		2,
		new Map().set(0, "full").set(1, "bust").set(2, "head"),
		["Full Body", "Bust (-20%)", "Head (-40%)"],
		["sticker", "sticker", "sticker"],
		[1, 0.8, 0.6]
	),
	new NewDropdown(
		editorSelects,
		2,
		new Map().set(0, "sketchy").set(1, "refined"),
		["Sketchy", "Refined (+$15)"],
		["sticker", "sticker"],
		[0, 15]
	),
	new NewDropdown(
		editorSelects,
		2,
		new Map().set(0, "plain").set(1, "colored").set(2, "shaded"),
		["Plain", "Colored (+$25)", "Shaded (+$50)"],
		["sticker", "sticker", "sticker"],
		[0, 25, 50]
	),
]

let productDropdown =
	new NewDropdown(
		productAddSelect,
		0,
		new Map().set(0, "sticker").set(1, "emoji").set(2, "char_art"),
		["STICKER SET", "EMOJI SET", "CHARACTER ART"],
		["sticker", "emoji", "char_art"]
	);