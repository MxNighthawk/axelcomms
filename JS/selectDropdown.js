class Option
{
	index;
	detail;
	value;

	constructor(element)
	{
		this.detail = getComputedStyle(element).backgroundImage;
		this.value = element.innerText;
	}
}

class Dropdown
{
	list;
	nameDisplay;
	options = [];
	active = false;

	constructor(display, internalList, options)
	{
		this.list = internalList;
		this.nameDisplay = display;
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