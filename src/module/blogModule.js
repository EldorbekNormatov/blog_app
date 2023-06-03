class BlogModule {
    constructor(id, title, text, user_id, seen) {

        this.id = id,
        this.title = title,
        this.text = text,
        this.user_id = user_id,
        this.seen = 0
    }
}

module.exports = BlogModule