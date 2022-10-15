# NgvDialog

An open source library for angular , generated in angular 14

## Why Ngv Dialog ?

* it's open source.
* you can open dialog by routes and service that we provided before ...
* you can set attributes like space and clickable back-drop etc .
* you don't need to add any component tag in your code .
* you will use just a service to work with package and nothing else .


## How to use ?


* `npm install ngv-dialog` - to install package in your project.
* In your AppModule import the NgvDialogModule
* then in your component use `NgvDialog` to work with that
```ts
import { NgvDialogModule } from 'ngv-dialog';
imports: [
  ...
    NgvDialogModule,
  ...
]
```

```ts
import { NgvDialog } from 'ngv-dialog';
@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngvDialog = inject(NgvDialog);
  openDialog(): void {
    this.ngvDialog.open(MyExampleComponent)
  }
}

```

* you can set some configuration like the below code :
* `backDropClose` - a boolean value , to be able to close dialog by click to backdrop.
* `space` - a number value , the space around dialog sheet and content.
* `backDropStyle` - a string value , could be `none` for default value , `blur` and `gray`.

```ts
this.ngvDialog.open(MyExampleComponent, {
  backDropClose: true,
  space: 16,
  backDropStyle: 'blur',
})
```

* you can close dialog by use `close('your message')` that could be any type and send a message to close subscriber.

```ts
this.ngvDialog.open(MyExampleComponent).afterClose().then(closeMessage => {
  // there will got 'my close message could be any type'
})

// and in the MyExampleComponent you can close it
closeAction(): void {
  this.ngvDialog.close('my close message could be any type')
}
```

* as you can see at below code, use can use set a data to use it when dialog opened.

```ts
this.ngvDialog.open(MyExampleComponent, {
  data: {
    userData: {
      gitHub: 'https://github.com/wahidwex'
    }
  }
})
```
```ts
import { NgvDialog } from 'ngv-dialog';
@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class MyExampleComponent implements OnInit {
  ngvDialog = inject(NgvDialog);
  ngOnInit(): void {
    const data = this.ngvDialog.getData();
  ...
  }
}
```

## How to open dialog by routes?

* when you want to import the module , which will open your dialog as you want , like below
```ts
import { NgvDialogModule } from 'ngv-dialog';
imports: [
  ...
    NgvDialogModule.setRoutes({
      options : {
        backDropClose: true,
        space: 16,
        backDropStyle: 'blur',
      },
      list: [
        {
          fragment: 'article',
          component: ArticleComponent
        },
        {
          fragment: 'example',
          component: MyExampleComponent
        },
      ],
    }),
  ...
]
```
* so when you want to open `MyExampleComponent` you just need to add `example` fragment ...
