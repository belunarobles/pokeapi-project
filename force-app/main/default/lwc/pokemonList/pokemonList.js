import { NavigationMixin } from 'lightning/navigation';
import { LightningElement, wire, track } from 'lwc';
import filterByEverything from '@salesforce/apex/PokemonController.filterByEverything';
export default class PokemonList extends NavigationMixin(LightningElement) {
	get hasResults() {
		return (this.pokemons.data.length > 0);
	}
    handlePokemonView(event) {
		const pokemonId = event.detail;
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: pokemonId,
				objectApiName: 'Pokemon__c',
				actionName: 'view',
			},
		});
	}

    @track valueType;
    @track optionsType = [
        {label: 'Todos', value: ''},
        {label: 'Normal', value: 'Normal'},
        {label: 'Fighting', value: 'Fighting'},
        {label: 'Flying', value: 'Flying'},
        {label: 'Poison', value: 'Poison'},
        {label: 'Ground', value: 'Ground'},
        {label: 'Rock', value: 'Rock'},
        {label: 'Bug', value: 'Bug'},
        {label: 'Ghost', value: 'Ghost'},
        {label: 'Steel', value: 'Steel'},
        {label: 'Fire', value: 'Fire'},
        {label: 'Water', value: 'Water'},
        {label: 'Grass', value: 'Grass'},
        {label: 'Electric', value: 'Electric'},
        {label: 'Psychic', value: 'Psychic'},
        {label: 'Ice', value: 'Ice'},
        {label: 'Dragon', value: 'Dragon'},
        {label: 'Dark', value: 'Dark'},
        {label: 'Fairy', value: 'Fairy'},
        {label: 'Unknown', value: 'Unknown'},
        {label: 'Shadow', value: 'Shadow'},
    ];
    @track allValues = [];

    @track valueGeneration;
    @track optionsGeneration = [
        {label: 'Todos', value: ''},
        {label: 'Generación 1', value: '1'},
        {label: 'Generación 2', value: '2'},
        {label: 'Generación 3', value: '3'},
        {label: 'Generación 4', value: '4'},
        {label: 'Generación 5', value: '5'},
        {label: 'Generación 6', value: '6'},
        {label: 'Generación 7', value: '7'},
        {label: 'Generación 8', value: '8'},
    ];

    searchName = '';
    types = '';
    generation = '';
    searchWrapper = {
        searchName: this.searchName,
        filterTypes: this.types,
        filterGeneration: this.generation
    }

    @wire(filterByEverything, { wrapper: '$searchWrapper'})
    pokemons;

    get quantityOfPokemons() {
        return this.pokemons.data.length;
    }
    
    handleSearchNameChange(event) {
		window.clearTimeout(this.delayTimeout);
        this.searchName = event.target.value
		this.delayTimeout = setTimeout(() => {
			this.searchWrapper = {
                ...this.searchWrapper,
                searchName: this.searchName
            }
		}, 300);

	}

    handleChangeType(event) {
        if(!this.allValues.includes(event.target.value)){
            this.allValues.push(event.target.value);
        }
        this.searchWrapper = {
            ...this.searchWrapper,
            filterTypes: (this.types = this.types + ";" + event.target.value)
	    }
    }

    handleRemoveType(event){
        const valueRemoved = event.target.name;
        if (this.types.includes(valueRemoved)) {
            const valuesAsArray = this.types.split(";");
            const arrayWithoutRemovedValue = valuesAsArray.filter((v) => v !== valueRemoved);
            this.types = arrayWithoutRemovedValue.join(";");
            this.searchWrapper = {
                ...this.searchWrapper,
                filterTypes: this.types
            }
        }
        this.allValues.splice(this.allValues.indexOf(valueRemoved), 1);
    }

    handleChangeGeneration(event){
        this.generation = event.target.value
        this.searchWrapper = {
            ...this.searchWrapper,
            filterGeneration: this.generation 
	    }
    }

    pokemonCounter(event){
        return Object.keys(object).length
    }
        
    
}