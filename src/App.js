import React from 'react';

import Menu from './Menu';
import Footer from './Footer';
import Loader from './Loader/Loader'

import './styles.css';

class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            loader: true,
            goods: [],
            purchases: [],
            sum: 0
        };
    }
    
    componentDidMount() {
        (async () => {
            await fetch('https://jsonplaceholder.typicode.com/photos')
                .then(res => res.json())
                .then(data => {
                    this.setState({
                        goods: data
                    });
                });
            this.setState({
                loader: false
            });
            const arr = this.state.goods.forEach( item => {
                item.model = item.id * item.albumId;
                item.propety = item.id + item.albumId;
                item.detail = false;
                item.button = false;
            });
        })();
    }
    
    setStateSum() {
        let sum = 0;
        this.state.purchases.forEach( item => {
            sum += item.sum;
        });
        this.setState({
            sum
        });
    }
    
    handleClick(e) {
        const tag = e.target.tagName.toLowerCase();
        const article = e.target.parentNode;
        const index = article.getAttribute('data-key');
        const input = article.querySelector('input');
        
        if(tag === 'img' || tag === 'h3') {
            this.state.goods[index].detail = !this.state.goods[index].detail;
            this.setState({
                goods: this.state.goods
            });
        }
        if( tag === 'button' && Number(input.value) ) {
            const ob = {
                id: this.state.goods[index].id,
                n: Number(input.value),
                title: this.state.goods[index].title,
                price: this.state.goods[index].albumId,
                sum: this.state.goods[index].albumId * input.value,
                bool: false
            };
            this.state.purchases.forEach( item => {
                if(item.id === ob.id) {
                    item.sum += ob.sum;
                    item.n += ob.n;
                    this.setState({
                        purchases: this.state.purchases
                    });
                    ob.bool = true;
                    return;
                }
            });
            if(!ob.bool) {
                this.state.purchases.push(ob);
                this.setState({
                    purchases: this.state.purchases
                });
            }
            input.value ='';
            this.setStateSum();
            this.state.goods[index].button = false;
            this.setState({
                goods: this.state.goods
            });
        }
    }
    
    handleChange(e) {
        const tag = e.target.tagName.toLowerCase();
        const index = e.target.parentNode.getAttribute('data-key');
        if(tag === 'input') {
            const num = Number(e.target.value);
            if( !Number.isInteger(num) 
                    || Number(num) < 0 
                    || Number(num) > 1000 
            ) {
                e.target.value = '';
                this.state.goods[index].button = false;
            }
        }
        if(e.target.value) {
            this.state.goods[index].button = true;
        }
        this.setState({
            goods: this.state.goods
        });
    }
    
    deleteItem(i) {
        return () => {
            if(this.state.purchases[i].n > 1) {
                this.state.purchases[i].n--;
                this.state.purchases[i].sum -= this.state.purchases[i].price;
            } else {
                this.state.purchases.splice(i, 1);
            }
            this.setState({
                purchases: this.state.purchases
            });
            this.setStateSum();
        };
    }
    
    clearBasket() {
        this.setState({
            purchases: [],
            sum: 0
        });
    }

    render() {
        return (
            <div className="App">
                <Menu />
                <div className='container main'>
                    <main 
                        onClick={this.handleClick.bind(this)}
                        onChange={this.handleChange.bind(this)}
                    >
                        <h2>Список товаров</h2>
                        {this.state.loader ? <Loader /> : ''}
                        {this.state.goods.map( (item, index) => {
                            return (
                                <article data-key={index} key={index}>
                                    <img 
                                        src={item.thumbnailUrl}
                                        title='Узнать больше о товаре'
                                    />
                                    <h3 title='Узнать больше о товаре'>{item.title}</h3>
                                    <h4>Цена: {item.albumId} руб.</h4>
                                    {item.detail 
                                        ? <div className="description">
                                            <p>Модель: {item.model}</p>
                                            <p>Характеристика: {item.propety}</p>
                                          </div>
                                        : ''}
                                    <h5>Выберите нужное число товара: </h5>
                                    <input 
                                        type="text" 
                                        valuedefault=""
                                    />
                                    {item.button ?
                                        <button title='Добавить в корзину указанное количество товара'>
                                            Добавить в корзину
                                        </button>
                                        : ''
                                    }
                                    </article>
                            );
                        })}
                    </main>
                    <aside>
                        <div className="basket">
                            <h2>Корзина</h2>
                            {this.state.purchases.map( (item, index) => {
                                return (
                                    <article data-key={index} key={index}>
                                        <h3>{item.title}</h3>
                                        <h4>Цена за {item.n} ед.: {item.sum} руб.</h4>
                                        <button 
                                            onClick={this.deleteItem.bind(this)(index)}
                                            title='Удалить одну единицу товара'
                                        >
                                            Удалить
                                        </button>
                                    </article>
                                );
                            })}
                            <h5>Итого: {this.state.sum} руб.</h5>
                            {this.state.purchases.length 
                                ? <button 
                                    onClick={this.clearBasket.bind(this)} 
                                    title='Удалить все товары из корзины'
                                >
                                    Очистить корзину
                                </button>
                                : ''
                            }
                        </div>
                    </aside>
                </div>
                <Footer />
            </div>
        );
    }
};

export default App;
