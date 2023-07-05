class Confettiful{
  el:HTMLElement;
  containerEl:HTMLElement | null;
  confettiColors:string[]
  confettiAnimations:string[]
  confettiFrequency:number
  confettiInterval?:NodeJS.Timer;
  constructor(el:HTMLElement){
   
    this.el = el;
    this.containerEl = null;
    this.confettiFrequency = 3;
    this.confettiColors = ['#EF2964', '#00C09D', '#2D87B0', '#48485E','#EFFF1D'];
    this.confettiAnimations = ['slow', 'medium', 'fast'];
    this._setupElements();
   
  }
  _setupElements(){
    const containerEl = document.createElement('div');
    containerEl.style.zIndex="-1";
    const elPosition:string = this.el.style.position;
    
    if ((elPosition !=='relative')) {
      this.el.style.position = 'relative';
    }
    if ((elPosition !=='absolute')) {
      this.el.style.position = 'absolute';
    }
    
    containerEl.classList.add('confetti-container');
    
    this.el.appendChild(containerEl);
    
    this.containerEl = containerEl;
  }
  _renderConfetti(){
    this.confettiInterval = setInterval(() => {
      const confettiEl = document.createElement('div');
      const confettiSize = (Math.floor(Math.random() * 3) + 7) + 'px';
      const confettiBackground = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
      const confettiLeft = (Math.floor(Math.random() * this.el.offsetWidth)) + 'px';
      const confettiAnimation = this.confettiAnimations[Math.floor(Math.random() * this.confettiAnimations.length)];
      // adjust animation slow or medium or fast 
      confettiEl.classList.add('confetti', 'confetti--animation-' + confettiAnimation);
      confettiEl.style.left = confettiLeft;
      confettiEl.style.width = confettiSize;
      confettiEl.style.height = confettiSize;
      confettiEl.style.backgroundColor = confettiBackground;
       setTimeout(function() {
        confettiEl.parentElement!.removeChild(confettiEl);
      }, 3000);
      
      this.containerEl!.appendChild(confettiEl);
    }, 25);
  }
  _stopAnimation(){
    const myele =document.querySelector(".confetti-container")
    if(  myele  ){
      myele.classList.remove("confetti");
    }

  }
}
export{
  Confettiful
}