// Author: Cameron Coleman
// CSE 120 Spring 2025
// Intro to JavaScript with Linked-Based Game. Learning the dot structure for objects.

window.inventory = {
    Advice: false,
    USB: false,
    Key: false,
    USBused: false
};

class Start extends Scene {
    create() {
        
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {

        if (key === "Door") {
            const outcome = (window.inventory.Key) ? "EndS" : "Nope1";
            this.engine.gotoScene(Location, outcome);
            return; // prevent adding choices
        }
        if (key === "Desk") {
            const outcome = (window.inventory.USBused) ? "Key" : "Nope2";
            this.engine.gotoScene(Location, outcome);
            return; // prevent adding choices
        }
        if (key === "Air Duct End") {
            const outcome = (window.inventory.Advice) ? "Air Duct EndS" : "Nope3";
            this.engine.gotoScene(Location, outcome);
            return; // prevent adding choices
        }

        if (key === "USB") {
            window.inventory.USB = true;
        }
        if (key === "UseUSB"){
            window.inventory.USB = false;
            window.inventory.USBused = true;
        }
        if (key === "KeyS") {
            window.inventory.Key = true;
        }
        if (key === "Livestream") {
            window.inventory.Advice = true;
        }

        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        
        if(locationData.Choices && locationData.Choices.length>0) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
            if (!choice) {
              this.engine.gotoScene(End);
              return;
            }
            
            if (choice.Target === "USB" && !window.inventory.USB) {
                window.inventory.USB = true;
            }
            if (choice.Target === "Livestream" && !window.inventory.Advice) {
                window.inventory.Advice = true;
            }
            if (choice.Target === "Key" && !window.inventory.Key) {
                window.inventory.Key = true;
            }

            // show the choice text
            this.engine.show("> " + choice.Text);
        
            // grab the next key and its JSON data
            const nextKey     = choice.Target;
            const data        = this.engine.storyData.Locations[nextKey] || {};
            const sceneName   = data.scene || "Location";       // default to Location
            const SceneClass  = sceneMap[sceneName] || Location; 
        
            // now dispatch into the right subclass
            this.engine.gotoScene(SceneClass, nextKey);
    }
}

class Terminal extends Scene {
    create(key){
        let locationData = this.engine.storyData.Locations[key]; 
        this.engine.show(locationData.Body); 

        if(locationData.Choices && locationData.Choices.length>0) { 
            for(let choice of locationData.Choices) { 
                if(window.inventory.USB || choice.Target != "UseUSB")
                    this.engine.addChoice(choice.Text, choice); // LOCATION SPECIFIC: IF USB IS FOUND SHOW OPTION OTHERWISE DON'T
        }
        } else {
            this.engine.addChoice("The end.")
        }
    }
    handleChoice(choice) {
        if (!choice) {
          this.engine.gotoScene(End);
          return;
        }
    
        if (choice.Target === "USB" && !window.inventory.USB) {
            window.inventory.USB = true;
        }
        if (choice.Target === "Livestream" && !window.inventory.Advice) {
            window.inventory.Advice = true;
        }
        if (choice.Target === "Desk" && !window.inventory.Key) {
            window.inventory.Key = true;
        }

        // show the choice text
        this.engine.show("> " + choice.Text);
    
        // grab the next key and its JSON data
        const nextKey = choice.Target;
        const data = this.engine.storyData.Locations[nextKey] || {};
        const sceneName = data.scene || "Location";
        const SceneClass = sceneMap[sceneName] || Location; 
    
        // now dispatch into the right subclass
        this.engine.gotoScene(SceneClass, nextKey);
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

const sceneMap = {
    Location,   // default
    Terminal,
    Start,
    End
  };

Engine.load(Start, 'myStory.json');