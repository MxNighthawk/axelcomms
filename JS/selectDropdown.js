class Option
{
	index;
	detail;
	value;

	constructor(parent, index)
	{
		let element = parent.getElementsByClassName("option")[index];

		this.detail = element.style.backgroundImage;
		this.value = element.innerText;
	}
}

class Dropdown
{
	list;
	nameDisplay;
	options = [];
	active = false;

	constructor(parent, options)
	{
		this.list = parent.getElementsByClassName("selectList")[0];
		this.nameDisplay = parent.getElementsByClassName("selectedName")[0];
		this.options = options;

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
		this.nameDisplay.style.setProperty("backgroundImage", `${this.options[indx].detail}`);
		this.list.style.setProperty("display", "none");
	}
}