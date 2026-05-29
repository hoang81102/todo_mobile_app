from bson import ObjectId


def serialize(doc: dict) -> dict:
    """
    Chuyển _id ObjectId → string 'id'.
    Gọi trước khi trả về dữ liệu cho Pydantic schema.
    """
    if doc is None:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    # Nếu có các ObjectId field khác thì chuyển sang string
    for key in ("userId", "categoryId"):
        if key in doc and isinstance(doc[key], ObjectId):
            doc[key] = str(doc[key])
    return doc


def to_object_id(id_str: str) -> ObjectId:
    """Validate và chuyển string → ObjectId. Raise ValueError nếu invalid."""
    if not ObjectId.is_valid(id_str):
        raise ValueError(f"Invalid ObjectId: {id_str}")
    return ObjectId(id_str)
