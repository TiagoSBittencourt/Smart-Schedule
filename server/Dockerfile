FROM python:3.12-slim

# Sets the environment  variables for container otimization
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIP_NO_CACHE_DIR=1
ENV FLASK_APP=app:app
ENV GUNICORN_CMD_ARGS="--bind=0.0.0.0:5000"


# Create a user and a group not root for the application for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Sets the owner of files to the non-root user 
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]