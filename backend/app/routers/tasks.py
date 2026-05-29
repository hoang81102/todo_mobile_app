from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app import schemas
from app.auth import get_current_user
from app.database import get_tasks_col
from app.models import serialize, to_object_id

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get("", response_model=schemas.TaskListResponse)
async def get_tasks(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = None,
    taskDate: Optional[str] = None,
    categoryId: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
):
    """Lấy danh sách tasks của user hiện tại."""
    col = get_tasks_col()
    query = {"userId": current_user["id"]}

    if status_filter:
        query["status"] = status_filter
    if priority:
        query["priority"] = priority
    if taskDate:
        query["taskDate"] = taskDate
    if categoryId:
        query["categoryId"] = categoryId
    if search:
        query["title"] = {"$regex": search, "$options": "i"}

    total = await col.count_documents(query)
    cursor = col.find(query).sort("taskDate", -1).skip((page - 1) * page_size).limit(page_size)
    docs = await cursor.to_list(length=page_size)
    tasks = [schemas.TaskOut(**serialize(d)) for d in docs]

    return schemas.TaskListResponse(tasks=tasks, total=total, page=page, page_size=page_size)


@router.post("", response_model=schemas.TaskOut, status_code=status.HTTP_201_CREATED)
async def create_task(
    body: schemas.TaskCreate,
    current_user: dict = Depends(get_current_user),
):
    """Tạo task mới."""
    col = get_tasks_col()
    now = datetime.utcnow()
    doc = {
        **body.model_dump(),
        "userId": current_user["id"],
        "createdAt": now,
        "updatedAt": None,
    }
    result = await col.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    return schemas.TaskOut(**doc)


@router.get("/{task_id}", response_model=schemas.TaskOut)
async def get_task(
    task_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Chi tiết một task."""
    try:
        oid = to_object_id(task_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Task ID không hợp lệ")

    col = get_tasks_col()
    doc = await col.find_one({"_id": oid, "userId": current_user["id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Task không tìm thấy")
    return schemas.TaskOut(**serialize(doc))


@router.put("/{task_id}", response_model=schemas.TaskOut)
async def update_task(
    task_id: str,
    body: schemas.TaskUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Cập nhật task."""
    try:
        oid = to_object_id(task_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Task ID không hợp lệ")

    updates = body.model_dump(exclude_unset=True)
    updates["updatedAt"] = datetime.utcnow()

    col = get_tasks_col()
    doc = await col.find_one_and_update(
        {"_id": oid, "userId": current_user["id"]},
        {"$set": updates},
        return_document=True,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Task không tìm thấy")
    return schemas.TaskOut(**serialize(doc))


@router.patch("/{task_id}/status", response_model=schemas.TaskOut)
async def update_status(
    task_id: str,
    new_status: str = Query(..., description="pending | completed | cancelled"),
    current_user: dict = Depends(get_current_user),
):
    """Cập nhật nhanh trạng thái task."""
    if new_status not in {"pending", "completed", "cancelled"}:
        raise HTTPException(status_code=400, detail="Status không hợp lệ")

    try:
        oid = to_object_id(task_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Task ID không hợp lệ")

    col = get_tasks_col()
    doc = await col.find_one_and_update(
        {"_id": oid, "userId": current_user["id"]},
        {"$set": {"status": new_status, "updatedAt": datetime.utcnow()}},
        return_document=True,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Task không tìm thấy")
    return schemas.TaskOut(**serialize(doc))


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Xóa task."""
    try:
        oid = to_object_id(task_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Task ID không hợp lệ")

    col = get_tasks_col()
    result = await col.delete_one({"_id": oid, "userId": current_user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task không tìm thấy")
