export interface Food {
    name: string,
    price: number
}

export interface Shop {
    name: string,
    menus: Food[],
    ownerId: string
}

export interface Owner {
    name: string,
    birth: Date,
    addr: string,
    profit: number
}

export interface Member {
    name: string,
    birth: Date,
    addr: string,
    money: number
}

export interface Order {
    memberId: string,
    ownerId: string,
    when: Date,
    foods: Food[]
}